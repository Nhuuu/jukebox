// Load environment variables
require('dotenv').config();
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
app.use((req, res, next) => {
	res.locals.alerts = req.flash();
	res.locals.user = req.user; 
	next();
});

// Routes
app.get('/', (req, res) => {
	res.render('home');
});


// request token and start timeout loop
// var tokenExpirationEpoch;
// var numberOfTimesUpdated = 0;

// setInterval(function() {
//   console.log(
//     'Time left: ' +
//       Math.floor(tokenExpirationEpoch - new Date().getTime() / 10000) +
//       ' seconds left!'
//   );

//   // OK, we need to refresh the token. Stop printing and refresh.
//   if (++numberOfTimesUpdated > 5) {
//     clearInterval(this);
//     // Refresh token and print the new time to expiration.
//     spotifyApi.refreshAccessToken().then(
//       function(data) {
//         tokenExpirationEpoch =
//           new Date().getTime() / 1000 + data.body['expires_in'];
//         console.log(
//           'Refreshed token. It now expires in ' +
//             Math.floor(tokenExpirationEpoch - new Date().getTime() / 10000) +
//             ' seconds!'
//         );
//       },
//       function(err) {
//         console.log('Could not refresh the token!', err.message);
//       }
//     );
//   }
// }, 10000);

// Include controllers
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
app.use('/party', loggedIn, require('./controllers/party')); 
app.use('/jukebox', loggedIn, require('./controllers/jukebox'));
app.use('/search', loggedIn, require('./controllers/search'));
// app.use('/party', require('./controllers/party')); 
// app.use('/jukebox', require('./controllers/jukebox'));
// app.use('/search', require('./controllers/search'));


app.listen(process.env.PORT||8000);