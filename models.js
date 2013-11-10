var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.UserSchema = Schema({
    name: {
        first: {
            type: String,
            default: '', // for Anonymous
            trim: true
        },
        last: {
            type: String,
            default: '',
            trim: true
        }
    },
    /*
    // Following code is if we ever want to expand to logins
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: [validators.notEmpty, 'email is empty!']
    }
    messages: [ { type:Schema.Types.ObjectId, ref:'Message' } ]
    */
});

exports.MessageSchema = Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    body: String
});

exports.MessageModel = mongoose.model('Message', exports.MessageSchema);
exports.UserModel = mongoose.model('User', exports.UserSchema);

