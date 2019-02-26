var express = require('express');
var router = express.Router();
var io = require('socket.io');

//Display the group chat room
router.get('/', (req, res) => {   
  res.render('parties/chat');
})

// io.sockets.on('connection', function(socket) {
//   socket.on('username', function(username) {
//       socket.username = req.user.username;
//       io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
//   });

//   socket.on('disconnect', function(username) {
//       io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
//   })

//   socket.on('chat_message', function(message) {
//       io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
//   });

// });


module.exports = router;