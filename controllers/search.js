require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');

var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['playlist-modify-private', 'app-remote-control', 'user-read-currently-playing', 'playlist-read-private', 'user-modify-playback-state', 'streaming', 'playlist-read-collaborative'],
  redirectUri = 'https://partyjukebox.herokuapp.com/',
  clientId = '5fe01282e44241328a84e7c5cc169165',
  state = 'some-state-of-my-choice';

var credentials = {
  clientId: process.env.SPOTIFY_API_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:8000/search/guestinput'
};
var spotifyApi = new SpotifyWebApi(credentials);
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
var code = process.env.SPOTIFY_AUTH_CODE

// var code = process.env.SPOTIFY_AUTH_CODE;

spotifyApi.authorizationCodeGrant(code).then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  },
  function(err) {
    console.log('Something went wrong with authorization!', err);
  }
);

// Refresh token 
spotifyApi.refreshAccessToken().then(
  function(data) {
    console.log('The access token has been refreshed!');
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Could not refresh the token!', err.message);
  }
)
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