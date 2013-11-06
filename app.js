// Be sure to use 2-space indenting, no tabs!
// Also, use single quotes for js strings, but 
// use double quotes for JSON!

// Let's kill this guys ;) 
// - Lucas

var express = require('express');
var app = express();
var port = 20069;

// Set template root & jade engine.
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// Set the root where we gather static files
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.render('base');
});

// app.listen(port);
// We are binding socket.io, a realtime library which
// syncs the client & server, to the port where our app 
// normally would listen.
var io = require('socket.io').listen(app.listen(port));
console.log('Listening on port ' + port);


// "io.sockets" referrs to all connected users.
// "io.socket" refers just to the one socket which
// has performed an action.
// The below code states that if any one of our client 
// sockets makes a connection to the server, give a 
// welcome message. Also, bind a reciever to that client so 
// that if it sends out a "send" message, we recieve it and
// re-emit it to all of our sockets
io.sockets.on('connection', function(socket) {
  socket.emit('message', { message: 'welcome to antchatter!' });
  socket.on('send', function(data) {
    io.sockets.emit('message', data);
  });
});

/* Outdated, we now use express framework
var http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World');
  response.end();
}).listen(20069);
*/
