var express = require('express');
var router = express.Router();

// Include ref to middleware > loggedIn.js
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin')

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
