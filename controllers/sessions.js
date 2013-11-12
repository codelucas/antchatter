var UserModel = require('../models').UserModel;
var RoomModel = require('../models').RoomModel;

exports.handleErr = function(socket, msg, err) {
    err = typeof err !== 'undefined' ? err : 'error';
    socket.emit(err, { message : 'error '+msg });
}

exports.getRoom = function(long, lat) {
    RoomModel.findOne({}, function(err, room) {
        if (err) {
            exports.handleErr(socket, 'room read err');
            return;
        }
        return room;
    });
}

// 'data' contains a dict w/ first & last name. It also
// contains a long, lat tuple.
exports.login = function(io, socket, data) {
    // Ensure there are no duplicate emails.
    UserModel.findOne(
        { 'name.first' : data.name.first, 'name.last' : data.name.last },
        function(err, user) {
            if (err) { 
                exports.handleErr(socket, 'reading users'); 
                return; 
            }    
            // There is a duplicate
            if (user) {
                console.warn('we have a nickname in use', user.name);
                exports.handleErr(socket, 'duplicate user');
                return;
            } 
            // No duplicates or errors, find a room for our new
            // user and set some meta data in the socket!
            var roomDoc = exports.getRoom(data.longitude, data.latitude);
            // socket.location = { data.longitude, data.latitude };
            socket.roomId = roomDoc._id;
            socket.roomName = roomDoc.name;
            socket.name = data.name;

            // Move the user's socket into an appropriate room.
            socket.join(roomName);
            
            // Save the model 
            var newUser = new UserModel();
            newUser.name = data.name;
            newUser.save(function() {
                socket.emit('login_ok', {
                    name: data.name,
                    roomName: roomName,
                    longitude: data.longitude,
                    latitude: data.latitude
                });
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
        { 'name.first' : socket.name.first, 'name.last' : socket.name.last }, 
        function(err, user) {
            if (err) { 
                exports.handleErr(socket, 'reading users'); 
                return; 
            } 
            // The user we are trying to remove does not exist!
            if (!user) {
                exports.handleErr(socket, 'user not found', 'logout_err');
                return;
            }
            // Remove the user from db to free username
            user.remove(function() {
                socket.emit('logout_ok');
            });
        }
    );
    io.sockets.emit('disconnect_ok', {
        name: socket.user.name     
    }); 
}  

/*
// Following code if we want to expand to logins
exports.createUser = function(io, socket, data) {
    if (!data.email) {
        socket.emit('error', { message:'emails are required!' });
        return;
    }
    // Ensure there are no duplicate emails.
    var user = new UserModel();
    user.name.first = data.firstname;
    user.name.last = data.lastname;
    user.email = data.email;
    user.save(function(err, doc) {
        if (err) {
            socket.emit('error', { message:'login failure'+user.email });
        }
    });
    exports.login(io, socket, user);
}
*/

