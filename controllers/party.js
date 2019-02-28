require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');
var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['playlist-modify-private', 'app-remote-control', 'user-read-currently-playing', 'playlist-read-private', 'user-modify-playback-state', 'streaming', 'playlist-read-collaborative']

var credentials = {
  clientId: process.env.SPOTIFY_API_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://partyjukebox.herokuapp.com/callback'
};
var spotifyApi = new SpotifyWebApi(credentials);
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
console.log(authorizeURL);

// &state=34fFs29kd09

var code = 'AQBz-LZiikDMyUBqO4YbROBSHkGuARHCR0suBta6hgzb9odvYgpLWuRSZkgixTsEAssyczoKo1BgKdZHcIB6Mwv-JDSZmKhbml0E1PiE3T6ZsfIe2eMnBQ33DMDoFQUX1YjEhbuQI-h4qg-bf1EP2FRHEfgK5veokbcZ_rAc9OmflfCgRb-JThNjfhiZKD7TgFFMlT97TCS_iPPCNXGmRwYzbdzxeUMj808p61KHoCUS5kjMiB3WXUgUx-f2qnfA5Y-gBvdX-g'

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


setInterval(function() {
  // Refresh token and print the new time to expiration.
  spotifyApi.refreshAccessToken().then(
    function(data) {
      console.log('The access token has been refreshed!');
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Could not refresh the token!', err.message);
    }
  )
}, 3500000);





//Display the form once you're signed in or logged in
router.get('/', (req, res) => {   
    res.render('parties/new');
})

// POST route to create a new party and redirect to jukebox using partyId
router.post('/', (req, res) => {
  var playlist = JSON.stringify(req.body.partyname)
  db.user.findOne({
    where: {id: req.user.id}
  })
  .then(user => {
    db.party.findOrCreate({
      where: {
        partyname: req.body.partyname,
        token: req.body.token 
      }
    })
    .spread((party, created) => {
      user.addParty(party)
      .then(party => {
        spotifyApi.getUser('nutrinbar')
        .then(data => {
          console.log('Some information about this user to return', data.body.id);
          spotifyApi.createPlaylist('playlist', { 'public' : false })
            .then(data => {
              console.log('Created playlist!');
            }, (err) => {
              console.log('Something went wrong in creating a playlist!', err);
            })
        }, (err) => {
          console.log('Something went wrong finding the user!', err);
        })        
        res.redirect(`party/guest?token=${req.body.token}&action=`)
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

router.get('/test', (req, res) => {
  res.render('parties/testplayer');
})

// Get party and all songs for jukebox when token is entered.
// Add tracks to playlist/partyname
router.get('/guest', (req, res) => {
  db.party.findOne({
    where: { token: req.query.token },
  })
  .then(party => {
    db.song.findAll({
      where: { id: party.id } //check this
    })
    .then(foundSongs => {
      res.render('parties/guest', { party: party, songs: foundSongs })
    })
    .catch(err => {
      console.log('Error finding songs', err)
    })
  })
  .catch(err => {
    console.log('Error using token to get jukebox', err)
  })
})

router.get('/host', (req, res) => {
  db.party.findOne({
    where: { token: req.body.token },
  })
  .then(party => {
    db.party.findAll({
      where: {
        token: req.body.token
    } 
    })
    .then(foundSongs => {
      res.render('parties/host', { party: party })
      console.log("getthisshitttttt")
    })
    .catch(err => {
      console.log('Error finding songs', err)
    })
  })
  .catch(err => {
    console.log('Error using token to get jukebox', err)
  })
})


// POST route to create songs in the database tied to the partyId
// router.post('/song/:id', (req, res) => {
//   db.party.findOne({
//     where: {id: req.params.id}
//   })
//   .then(party => {
//     db.song.create({
//       artist: req.body.artist,
//       title: req.body.title
//     })
//     .then(song => {
//       console.log(song) 
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   })
//   .catch(err => {
//     console.log(err)
//   })
// })


// GET route for songs, pass through song object on render
// router.get('/:id', (req, res) => {
//   db.party.findOne({
//     where: {id: req.params.id}
//   })
//   .then(party => {
//     db.song.findAll({
//       where: {id: req.params.partyId}
//     })
//     .then(song => {
//       console.log('this is the song', song);
//       res.render('parties/jukebox', { song: song, party: party })
//     })
//     .catch(err => {
//       console.log('Error finding songs', err)
//     })
//   })
//   .catch(err => {
//     console.log('Error finding one party to show songs', err)
//   })
// })




module.exports = router;