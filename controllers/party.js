var express = require('express');
var router = express.Router();
var db = require('../models');


// Need post route for create party and redirect to jukebox using partyId
router.get('/', (req, res) => {
  res.render('parties/new');
})


// Get token page, tie to create party form
router.get('/token', (req, res) => {
  res.render('parties/token');
})


// POST route to create songs in the database



// GET route for songs, pass through song object on render



// Get main jukebox page, tie to join a party/nav, party Id is through req.body
router.get('/jukebox', (req, res) => {
  res.render('parties/jukebox');
})


module.exports = router;