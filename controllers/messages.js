var models = require('../models');
var MessageModel = models.MessageModel;

exports.broadcast = function(io, socket, data, callback) {
    if (!data.message) { 
        callback('no msg body provided');
    }
    var mbuild = {
        nickname: socket.nickname,
        univ: socket.univ,
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
