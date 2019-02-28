require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();


var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);
  })

router.post('/', (req, res) => {   
  console.log('search route', req.body)
  res.render('parties/search', {partytoken: req.body});
})

// router.post('/playlist', (req, res) => {
//   console.log(req.body.artist);
//   spotifyApi.searchArtists(req.body.artist)
//   .then(function(data) {
//     console.log(data)
//     spotifyApi.getArtistTopTracks(data.body.artists.items[0].id, 'US')
//  		.then(function(track){
//       console.log('we here', track)
//  		  // res.send('parties/jukebox', { artist: data.body, tracks: track.body.tracks.slice( 0 )});
//  		})
//  		.catch(function(err){
//       console.log(err);
//  		});
// 	})
// 	.catch(err => {
// 		console.log('error', { error: err });
// 	});
// });

router.post('/guestinput', (req, res) => {
  var myJSON = JSON.stringify(req.body);
  // myJSON this includes the partyname which is playlist name
  console.log('doug search json', myJSON)
  spotifyApi.searchTracks(String('track:')+req.body.track+String(' artist:')+req.body.artist)
    .then(function(data) {
      res.render('parties/search-result', {results: data.body.tracks});
      // res.send({result: data.body.tracks.items[0].album.id});
    }, function(err) {
      console.error(err);
    });
  });

router.get('/searchresult', (req, res) => {

})

  module.exports = router;