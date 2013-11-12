var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// http://mongoosejs.com/docs/2.7.x/docs/populate.html
exports.RoomSchema = Schema({
    coords: {
        lng: { type: Number, required: true },
        lat: { type: Number, required: true }
    },
    univ: { type: String, required: true, unique: true },
    range: {
        northeast: {
            lng: { type: Number, required: true },
            lat: { type: Number, required: true }
        },
        southwest: {
            lng: { type: Number, required: true },
            lat: { type: Number, required: true }
        }
    }
    // messages: [ { type: ObjectId, ref: 'Message' } ]
});

// User models are not persistant! They will be created 
// and deleted as users connect & disconnect. This model
// purely exists as a mechanism to reserve names.
exports.UserSchema = Schema({
    nickname: { type: String, trim: true }
});

exports.MessageSchema = Schema({
    nickname: { type: String, trim: true },
    univ: { type: String }, 
    timestamp: { type: Date, default: Date.now },
    body: String
});

exports.MessageModel = mongoose.model('Message', exports.MessageSchema);
exports.UserModel = mongoose.model('User', exports.UserSchema);
exports.RoomModel = mongoose.model('Room', exports.RoomSchema);


