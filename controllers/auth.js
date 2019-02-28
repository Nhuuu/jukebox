require('dotenv').config();
var express = require('express');
var passport = require('../config/passportConfig');
var router = express.Router();
var db = require('../models');

// const SpotifyStrategy = require('passport-spotify').Strategy;

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });


// passport.use(
//   new SpotifyStrategy(
//     {
//       clientID: process.env.SPOTIFY_API_CLIENT_ID,
//       clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//       callbackURL: 'http://localhost:8000/auth/spotify/callback'
//     },
//     function(accessToken, refreshToken, expires_in, profile, done) {
//       db.user.findOrCreate({ 
// 				where: {
// 					username: profile.username
// 				},
// 				defaults: {
// 					email: 'email@email.com',
// 					password: 'password',
// 					admin: false
// 				}
// 			})
// 			.spread((user, created) => {
// 				console.log(user.username)
//         return user.username;
//       });
//     }
//   )
// );


router.get('/login', (req, res) => {
	res.render('auth/login');
});


router.post('/login', passport.authenticate('local', {
	successRedirect: '/party',
	successFlash: 'Yay, login successful!',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid Credentials'
}));


// ROUTE to display signup page. PreviousData: was added on all signup renders.
router.get('/signup', (req, res) => {
	res.render('auth/signup', { previousData: null });
});


// POST route to sign up and create users
router.post('/signup', (req, res) => {
	if (req.body.password != req.body.passwordV){
		req.flash('error', 'Passwords must match!');
		res.render('auth/signup', { previousData: req.body, alerts: req.flash() }); 
	} else {
		db.user.findOrCreate({
			where: { username: req.body.username },
			defaults: req.body
		})
		.spread((user, created) => {
			if(created){
				req.flash('success', 'Yay! Good job! You signed up!');
				res.redirect('/party'); 
			}
			else {
				req.flash('error', 'Username already in use!');
				res.render('auth/signup', { previousData: req.body, alerts: req.flash() });
			}
		})
		.catch((err) => {
			if(err && err.errors){
				console.log(err.errors)
				err.errors.forEach((e) => {
					console.log(e);
					if(e.type == 'Validation error'){
						req.flash('error', 'Validation Error: ', e.message);
					}
					else {
						console.log('Error (not validation)', e);
					}
				})
			}
			res.render('auth/signup', { previousData: req.body, alerts: req.flash() });
		});
	}
});

router.get('/logout', (req, res) => {
	req.logout(); 
	req.flash('success', 'Come back again!');
	res.redirect('/');
});

// // SPOTIFY SPECIFIC ROUTES
// router.get('/spotify', passport.authenticate('spotify', {
//   // The request will be redirected to spotify for authentication, so this
// 	// function will not be called.
// 	scope: ['playlist-modify-private', 'app-remote-control', 'user-read-currently-playing', 'playlist-read-private', 'user-modify-playback-state', 'streaming', 'playlist-read-collaborative']
// }));


// // Why was this get?
// router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: 'auth/login' }),
//   function(req, res) {
//     // Successful authentication, redirect to the party.
//     res.redirect('/party');
//   }
// );


module.exports = router;