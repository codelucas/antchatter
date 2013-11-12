var models = require('../models');
var MessageModel = models.MessageModel;

var handleErr = require('./sessions').handleErr;

exports.broadcast = function(io, socket, data) {
    if (!data.message) { 
        handleErr(socket, 'no msg provided'); 
        return;
    }
    var mbuild = {
        name: socket.name,
        roomId:socket.roomId,
        timestamp: Date.now(),
        body: data.message
    };    
    var msg = MessageModel(mbuild);
    msg.save();
    // The geocoords don't get saved into msg model so
    // this line must come after .save(). This data is
    // needed on the client for computations though!
    mbuild['location'] = socket.location;
    io.sockets.in(socket.room).emit('broadcast_msg', mbuild);
}
