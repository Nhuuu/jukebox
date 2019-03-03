require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');

// var SpotifyWebApi = require('spotify-web-api-node');
// var spotifyApi = new SpotifyWebApi();

//spotify access token (remove token to env later)
// spotifyApi.setAccessToken(process.env.SPOTIFY_API);


// var spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_API,
//   clientSecret: process.env.SPOTIFY_CLIENT
// });


// Retrieve an access token
// spotifyApi
//   .clientCredentialsGrant()
//   .then(function(data) {
//     // Set the access token on the API object so that it's used in all future requests
//     spotifyApi.setAccessToken(data.body['access_token']);
//   })

// NHUUUUU
// router.get('/jkbx', (req, res) => {   
//   db.playlistUsers.find{
//    where: {
//     id: req.user.id
//   }
// })})
//   .then(playlist => {
//     res.render('playlists/jukebox', {playlist: playlist});
//     console.log(playlist);
//   })

// })

// router.post('/playlist', (req, res) => {
//   console.log(req.body.artist);
//   spotifyApi.searchArtists(req.body.artist)
//   .then(function(data) {
//     console.log(data)
//     spotifyApi.getArtistTopTracks(data.body.artists.items[0].id, 'US')
//  		.then(function(track){
//       console.log('we here', track)
//  		  // res.send('playlists/jukebox', { artist: data.body, tracks: track.body.tracks.slice( 0 )});
//  		})
//  		.catch(function(err){
//       console.log(err);
//  		});
// 	})
// 	.catch(err => {
// 		console.log('error', { error: err });
// 	});
// });

//add song to guest.ejs
router.post('/add', (req, res) => {
  console.log('search and adding song route', req.body)
  db.playlist.findOne({
    where: { 
      partyName: req.body.partyName
    }
  })
  .then(playlist => {
    db.song.findOrCreate({
      where:{ 
        imageUrl: req.body.imageUrl,
        artist: req.body.artist,
        title: req.body.title,
        spotifyId: req.body.spotifyId,
        playlistId: req.body.playlistId 
      }
    })
    .spread(function(newSong, created){
      playlist.addSong(newSong)  
      .then(function(){
        res.redirect('/jukebox/guest');
      })
      .catch(function(err){
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
})
  
router.get('/guest', (req, res) => {   
  db.playlist.findOne({
    where: { 
      partyName: req.body.partyName
    }
  })
  .then(function(playlist){
    playlist.getSongs()
    .then(function(songs){
      res.render('playlists/guest', {songs: songs})
    })
    .catch(err=>{
      console.log(err)
    })
	})
  .catch(err=>{
    console.log(err)
  })
})

module.exports = router;