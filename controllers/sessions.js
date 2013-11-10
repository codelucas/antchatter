// This file handles all user login-logout operations.

var UserModel = require('../models/user').UserModel;

exports.login = function(io, socket, data) {
    if (!data.email) {
        socket.emit('error', { message:'emails are required!' });
        return;
    }
    // Ensure there are no duplicate emails.
}


