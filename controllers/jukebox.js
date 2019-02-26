require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();

//spotify access token (remove token to env later)
spotifyApi.setAccessToken(process.env.SPOTIFY_API);


var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API,
  clientSecret: process.env.SPOTIFY_CLIENT
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);
  })

router.get('/', (req, res) => {   
  res.render('parties/jukebox');
})

router.post('/playlist', (req, res) => {
  console.log(req.body.artist);
  spotifyApi.searchArtists(req.body.artist)
  .then(function(data) {
    console.log(data)
    spotifyApi.getArtistTopTracks(data.body.artists.items[0].id, 'US')
 		.then(function(track){
       console.log('we here', track)
 			// res.send('parties/jukebox', { artist: data.body, tracks: track.body.tracks.slice( 0 )});
 		})
 		.catch(function(err){
      console.log(err);
 		});
	})
	.catch(err => {
		console.log('error', { error: err });
	});
});


spotifyApi.searchTracks('Love')
  .then(function(data) {
    console.log('Search by "Love"', data.body);
  }, function(err) {
    console.error(err);
  });


  module.exports = router;