require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');
// var SpotifyWebApi = require('spotify-web-api-node');
// var scopes = ['playlist-modify-private', 'app-remote-control', 'user-read-currently-playing', 'playlist-read-private', 'user-modify-playback-state', 'streaming', 'playlist-read-collaborative']
// var credentials = {
//   clientId: process.env.SPOTIFY_API_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   redirectUri: 'https://localhost:8000'
// };

// var spotifyApi = new SpotifyWebApi(credentials);

// var spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_API_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET
// });

// // Retrieve an access token
// spotifyApi
//   .clientCredentialsGrant()
//   .then(function(data) {
//     // Set the access token on the API object so that it's used in all future requests
//     spotifyApi.setAccessToken(data.body['access_token']);
//   })
// var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
// var code = process.env.SPOTIFY_AUTH_CODE

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



//Display the form once you're signed in or logged in
router.get('/', (req, res) => {   
    res.render('playlists/new');
})

// POST route to create a new playlist and redirect to jukebox using playlistId
router.post('/', (req, res) => {
  // var playlist = JSON.stringify(req.body.partyName)
  db.user.findOne({
    where: {id: req.user.id}
  })
  .then(user => {
    db.playlist.findOrCreate({
      where: {
        partyName: req.body.partyName,
        token: req.body.token 
      }
    })
    .spread((playlist, created) => {
      user.addPlaylist(playlist)
      .then(playlist => {
        
        // spotifyApi.getUser('nutrinbar')
        // .then(data => {
        //   console.log('Some information about this user to return', data.body);
        //   // spotifyApi.createPlaylist('playlist', { 'public' : false })
        //     // .then(data => {
        //     //   console.log('Created playlist!');
        //     // }, (err) => {
        //     //   console.log('Something went wrong in creating a playlist!', err);
        //     // })
        // }, (err) => {
        //   console.log('Something went wrong finding the user!', err);
        // })        
        res.redirect(`playlist/guest?token=${req.body.token}&action=`)
        // res.render('playlists/host', {playist: playlist})
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

// Get playlist and all songs for jukebox when token is entered.
// Add tracks to playlist/partyName
router.get('/guest', (req, res) => {
  db.playlist.findOne({
    where: { token: req.query.token },
  })
  .then(playlist => {
    db.song.findAll({
      where: { playlistId: playlist.id } 
    })
    .then(foundSongs => {
      res.render('playlists/guest', { playlist: playlist, songs: foundSongs })
    })
    .catch(err => {
      console.log('Error finding songs', err)
    })
  })
  .catch(err => {
    console.log('Error using token to get jukebox', err)
  })
})

// router.post('/guest', loggedIn, (req, res) => {
//   db.playlist.findOne({
//     where: { token: req.body.token },
//     include: [db.song]
//   })
//   .then(data => {
//     db.song.findOrCreate({
//       where:{ 
//         artist: req.body.artist,
//         title: req.body.title,
//         playlistId: req.body.playlistId 
//       }
//     })
//     .spread(song, created{
//       playlist.addSongs(song)
    
//     })
//     console.log('Retrieved playlists', data.body);
//   },function(err) {
//     console.log('Something went wrong!', err);
//   });
// 	res.redirect(`playlist/guest?token=${req.body.token}&action=`);
// });

// router.get('/host', (req, res) => {
//   console.log('is there token?', req.body)
//   db.playlist.findOne({
//     where: { token: req.body.token },
//   })
//   .then(playlist => {
//     console.log('teswting now blah', playlist)
//     res.render('playlists/host', { playlist: playlist })
//   })
//   .catch(err => {
//     console.log('Error finding songs', err)
//   })
// })


module.exports = router;