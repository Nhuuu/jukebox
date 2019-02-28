// Load environment variables
require('dotenv').config();

// Requires, imports of modules
var flash = require('connect-flash');
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var passport = require('./config/passportConfig');
// Declare a reference to the models folder, ./for the folder otherwise it'll look for a node module.
var db = require('./models');
var session = require('express-session');
// Declare express instance to use;
var app = express();
//bring loggedIn middleware
var loggedIn = require('./middleware/loggedIn');
//for Spotify
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();
//for socket.io
var io = require('socket.io');


//spotify access token (remove token to env later)
// spotifyApi.setAccessToken(process.env.SPOTIFY_API);

// Set the views to ejs
app.set('view engine', 'ejs');


// Use middleware
app.use(layouts);
app.use('/', express.static('public'));
// Now our form passes data
app.use(parser.urlencoded({ extended: false }));
// flash is dependent on session so put this above flash
// saveUnitialized, do you want to save it when it's empty >>>>> REVIEW
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	// if false the session object will not be stored. true for recurring visitors
	saveUninitialized: true
}));
// flash what we want to show the user on the request object
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware - write data to locals, this allows the data to be avl in views and js controller files.
// res.locals An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
app.use((req, res, next) => {
	res.locals.alerts = req.flash();
	// Comes from passportConfig, part of passport, contains the user to authenticate
	res.locals.user = req.user; // WHERE ARE WE USING req.user (profile.ejs, admin.ejs, isAdmin, loggedIn)
	//moves on to the next middleware
	next();
});

// Routes
app.get('/', (req, res) => {
	res.render('home');
});

// app.get('*', (req, res, next) => {
// 	res.status(404).send({ message: 'Not Found' });
// });

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    console.log('give me the mother fucking token bitch!', data)
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('The access token expires in ' + data.body['expires_in']);
  })

// request token and start timeout loop
var tokenExpirationEpoch;
var numberOfTimesUpdated = 0;

setInterval(function() {
  console.log(
    'Time left: ' +
      Math.floor(tokenExpirationEpoch - new Date().getTime() / 10000) +
      ' seconds left!'
  );

  // OK, we need to refresh the token. Stop printing and refresh.
  if (++numberOfTimesUpdated > 5) {
    clearInterval(this);
    // Refresh token and print the new time to expiration.
    spotifyApi.refreshAccessToken().then(
      function(data) {
        tokenExpirationEpoch =
          new Date().getTime() / 1000 + data.body['expires_in'];
        console.log(
          'Refreshed token. It now expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 10000) +
            ' seconds!'
        );
      },
      function(err) {
        console.log('Could not refresh the token!', err.message);
      }
    );
  }
}, 10000);

// Include controllers
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
app.use('/party', loggedIn, require('./controllers/party')); 
app.use('/jukebox', loggedIn, require('./controllers/jukebox'));
app.use('/search', loggedIn, require('./controllers/search'));
// app.use('/party', require('./controllers/party')); 
// app.use('/jukebox', require('./controllers/jukebox'));
// app.use('/search', require('./controllers/search'));


app.listen(8000);