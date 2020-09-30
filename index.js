var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.emit('chat message', 'New Socket Connected.')
  socket.room = 'lobby';
  socket.join('lobby')
  
  socket.on('create', function(data) {
    io.emit('chat message', 'Socket Joined Room: ' + data)
    socket.room = data;
    socket.join(data);
  });
  
  socket.on('join', function(data) {
    io.emit('chat message', 'Socket Joined Room: ' + data)
    socket.room = data;
    socket.join(data);
  });
  
  socket.on('chat', function(data) {
    io.emit('chat message', ('Socket said: ' + data + ' in ' + socket.room));
    io.in(socket.room).emit('chat', data);
  });
  
  socket.on('global chat', function(data) {
    io.emit('chat message', ('Socket said: ' + data + ' in global chat'));
    io.in('lobby').emit('global chat', data);
  });
  
  socket.on('event', function(data) {
    io.in(socket.room).emit('event', data);
  });

  
  socket.on('leave', function(data) {
    io.emit('chat message', ('Socket Left Room: ' + data));
