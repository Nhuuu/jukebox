require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../models');
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API,
  clientSecret: process.env.SPOTIFY_CLIENT
});

// Retrieve an access token

const refreshToken = () => {
  spotifyApi.clientCredentialsGrant()
  .then(data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err.message);
  });
}

setInterval(refreshToken, 3600000);


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
        spotifyApi.createPlaylist('playlist', { 'public' : true })
          .then(data => {
            console.log('Created playlist!', data);
          }, (err) => {
            console.log('Something went wrong!', err);
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

// const playlist = () => {
//   spotifyApi.createPlaylist('playlist', { 'public' : true })
//     .then(data => {
//       console.log('Created playlist!');
//     }, (err) => {
//       console.log('Something went wrong!', err);
//     })
// }

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