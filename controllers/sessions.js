var UserModel = require('../models').UserModel;
var RoomModel = require('../models').RoomModel;

/*
exports.handleErr = function(socket, msg, err) {
    err = typeof err !== 'undefined' ? err : 'error';
    socket.emit(err, { message : 'error '+msg });
}
*/

exports.getRoom = function(lng, lat) {
    RoomModel.findOne({}, function(err, room) {
        if (err) {
            socket.emit('error', { message : 'room reading err' });
            return;
        }
        return room;
    });
}

// 'data' contains a dict w/ { lng, lat, nickname }
// We churn lng, lat into a university name (chat room).
// The nickname is stored to prevent duplicates and to label
// chat messages with sender nicknames.
exports.login = function(io, socket, data, callback) {
    // Ensure there are no duplicate emails.
    UserModel.findOne(
        { 'nickname' : data.nickname },
        function(err, user) {
            if (err) { 
                callback('error reading users from mongo');
            }    
            // There is a duplicate
            if (user) {
                callback('we have a nickname in use '+user.nickname);
            } 
            // No duplicates or errors, find a room for our new
            // user and set some meta data in the socket!
            // var roomDoc = exports.getRoom(data.lng, data.lat);
            socket.nickname = data.nickname;
            socket.location = { lng: data.lng, lat: data.lat };
            socket.univ = 'heaven';// roomDoc.univ;

            // Move the user's socket into an appropriate room.
            socket.join(socket.univ);          

            // Save the model 
            var newUser = new UserModel();
            newUser.nickname = data.nickname;

            newUser.save(function() {
                socket.emit('login_ok', {
                    //nickname: data.nickname,
                    univ: socket.univ
                    //lng: data.lng,
                    //lat: data.lat
                });
                socket.broadcast.to(socket.univ).emit('broadcast_msg',
                    data.nickname+' has joined the room!');
            });
        } 
    );
}

exports.logout = function(io, socket, data) {
    // Custom logout logic goes here after we
    // actually build user accounts.
    exports.disconnect(io, socket);
}

exports.disconnect = function(io, socket) {
    UserModel.findOne(
        { 'nickname' : socket.nickname },
        function(err, user) {
            if (err) { 
                socket.emit('error', { message: 'reading users err' });
                return; 
            } 
            // The user we are trying to remove does not exist!
            if (!user) {
                socket.emit('error', { message: 'user not found' });
                return;
            }
            // Remove the user from db to free username
            user.remove(function() {
                // socket.emit('logout_ok');
            });
        }
    );
    socket.broadcast.to(socket.univ).emit(socket.nickname+' has left the room!');
}  
