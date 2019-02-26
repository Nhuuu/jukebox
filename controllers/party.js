var async = require('async');
var express = require('express');
var router = express.Router();
var db = require('../models');

//Display the form once you're signed in or logged in
router.get('/', (req, res) => {   
    res.render('parties/new');
})

//Need post route for create party and redirect to jukebox using partyId
// router.post('/', (req, res) => {
//   db.user.findOne({
//     where: {id: req.user.id},
//     // include: [db.party]
//   })
//   .then(function(party){
//     async.forEach(party, function(p, done){
//       db.party.findOrCreate({
//         where: {
//           partyname: req.body.partyname,
//           token: req.body.token
//         }
//       })
//       .spread(function(newParty, created){
//         user.addParty(newParty)
//         .then(function(){
//           done();
//         }).catch(done);
//       })
//       .catch(done);
//       }, function(){
//         res.redirect('/parties/jukebox');
//       })
//     })
//   .catch(function(err){
//     console.log(err);
//   })
// });



router.post('/', (req, res) => {
  db.user.find({
    where: {id: req.user.id}
  })
  .then(function(user){
    db.party.findOrCreate({
      where: {
        partyname: req.body.partyname,
        token: req.body.token 
      }
    })
    .spread(function(party, created){
      user.addParty(party)
      .then(function(party){
        res.redirect('/parties/jukebox'); 
      })
      .catch(function(err){
        console.log(err)
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

// Get token page, tie to create party form
router.get('/token', (req, res) => {
  res.render('parties/token');
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