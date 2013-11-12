// use 4-space indenting, no tabs!
// Also, use single quotes for js strings, but 
// use double quotes for JSON!

var settings = require('./settings');
var express = require('express');
var app = express();

var mongoose = require('mongoose');
var session = require('./controllers/sessions');
var messages = require('./controllers/messages');
var UserModel = require('./models').UserModel;
var RoomModel = require('./models').RoomModel;

// Set template root & jade engine.
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// New settings in express 3.0 for parsing POST data
app.use(express.bodyParser());

app.locals({
    rootUrl: settings.rootUrl,
    siteName: settings.appName,
    siteIp: settings.appIP,
    staticRoot: settings.staticRoot,
    sitePort: settings.appPort
});

// Connect to db
mongoose.connect('mongodb://'+settings.dbUserName+':'+
                 settings.dbPassWord+'@localhost:'+settings.dbPort);

app.get('/', function(req, res) {
    res.render('splash');
});

app.get('/test-chat', function(req, res) {
    res.render('home', { nickname: 'lucas' });
});

app.post('/', function(req, res) {
    var nickname = req.body.user.nickname;
    console.log('we got the nickname: '+nickname);
    res.render('home', { nickname: nickname });
});

var io = require('socket.io').listen(app.listen(Number(settings.appPort)));
console.log('Listening on port '+settings.appPort);

// "io.sockets" referrs to all connected users. "io.socket" refers 
// just to the one socket which // has performed an action.
io.sockets.on('connection', function(socket) {

    socket.on('login', function(data, callback) {
        session.login(io, socket, data, callback);
    });    

    socket.on('logout', function(data) {
        session.logout(io, socket, data);
    });    

    socket.on('send_message', function(data, callback) {
        messages.broadcast(io, socket, data, callback);
    });

    socket.on('disconnect', function(data) {
        session.disconnect(io, socket, data);
    });
});

