var express = require('express');
var router = express.Router();
var db = require('../models');
// Include ref to middleware > loggedIn.js
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin')
var SpotifyWebApi = require('spotify-web-api-node');
// var spotifyApi = new SpotifyWebApi();
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
    console.log('we the only one')
		// refreshToken();
	})
// var credentials = {
//   clientId: process.env.SPOTIFY_API_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   redirectUri: 'https://partyjukebox.herokuapp.com/'
// };
// var spotifyApi = new SpotifyWebApi(credentials);
// // var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
// // var code = process.env.SPOTIFY_AUTH_CODE

// var code = process.env.SPOTIFY_AUTH_CODE;

// spotifyApi.authorizationCodeGrant(code).then(
//   function(data) {
//     console.log('The token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);
//     console.log('The refresh token is ' + data.body['refresh_token']);
//     // Set the access token on the API object to use it in later calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//     spotifyApi.setRefreshToken(data.body['refresh_token']);
//   },
//   function(err) {
//     console.log('Something went wrong with authorization!', err);
//   }
// );

// // Refresh token 
// spotifyApi.refreshAccessToken().then(
//   function(data) {
//     console.log('The access token has been refreshed!');
//     spotifyApi.setAccessToken(data.body['access_token']);
//   },
//   function(err) {
//     console.log('Could not refresh the token!', err.message);
//   }
// )

// Add song to party
router.post('/', loggedIn, (req, res) => {
	db.user.findOne({
    where: {id: req.user.id}
  })
  .then(user => {
    db.party.findOne({
      where: {
        partyname: req.body.partyname,
        token: req.body.token 
      }
    })
    .spread((party, created) => {
      user.addParty(party)
      .then(party => {
        spotifyApi.createPlaylist(playlist, { 'public' : true })
        .then(data => {
          console.log('Created playlist!');
          res.redirect(`party/jukebox?token=${req.body.token}&action=`) 
        }, (err) => {
          console.log('Something went wrong!', err);
        })
      })
      .catch(err => {
        console.log("error 1", err)
      })
    })
    .catch(err => {
      console.log("error 2", err)
    })
  })
  .catch(err => {
    console.log("error 3", err)
  })
})

router.get('/', loggedIn, (req, res) =>{
	db.user.find({
		where: { id: req.user.id },
	})
	.then(function(user){
    user.getParties()
    .then(function(parties){
      res.render('profile', {parties: parties})
    })
	})
	.catch(function(err){
		console.log(err);
	})
})


// router.post('/add', loggedIn, (req, res) => {
// 	console.log('song add console', req.body)
// 	spotifyApi.getUserPlaylists('nutrinbar')
//   .then(function(data) {
//     console.log('Retrieved playlists', data.body);
//     res.render('parties/guest', {party: data});
//   },function(err) {
//     console.log('Something went wrong!', err);
//   });

router.post('/add', loggedIn, (req, res) => {
  console.log('search and adding song route', req.body)
  db.party.findOne({
    where: { 
      partyname: req.body.name
    },
  })
  .then(data => {
    db.song.findOrCreate({
      where:{ 
        artist: req.body.artist,
        title: req.body.title,
        partyId: req.body.partyId 
      }
    })
    .spread(newSong, created => {
      party.addSong(newSong)
      })
      .then(function(parties){
        res.render('parties/guest', {party: req.body});
      })
      .catch(function(err){
        console.log(err);
      })
    })
    
    })
  


// });
	// res.send('profile req.body', req.body)
	// {"name":"I Fall Apart","id":"75ZvA4QfFiZvzhj2xkaWAh"}
	// var name = req.body.name;
	// var id = req.body.id;
  // db.user.find({
  //   where: {id: req.user.id}
  // })
  // .then(user => {
  //   db.party.findOrCreate({
  //     where: {
  //       partyname: req.body.partyname,
  //       token: req.body.token 
  //     }
  //   })
  //   .spread((party, created) => {
  //     user.addParty(party)
  //     .then(party => {
	// 			res.render('profile');
  //       res.redirect(`party/host?token=${req.body.token}&action=`) 
  //     })
  //     .catch(err => {
  //       console.log("error 1", err)
  //     })
  //   })
  //   .catch(err => {
  //     console.log("error 2", err)
  //   })
  // })
  // .catch(err => {
  //   console.log("error 3", err)
  // })
// })


router.get('/admins', isAdmin, (req, res) => {
	res.render('admin');
});

router.get('/', isAdmin, (req, res) => {
	res.render('profile');
});





module.exports = router;
