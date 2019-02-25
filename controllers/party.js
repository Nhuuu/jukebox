var express = require('express');
var router = express.Router();
var db = require('../models');


// Need post route for create party
router.get('/', (req, res) => {
  res.send("party is here!");
})



// Get token page, tie to create party form
router.get('/token', (req, res) => {
  res.send('token is here!');
})


// Get main jukebox page, tie to join a party/nav for jukebox
router.get('/jukebox')





module.exports = router;