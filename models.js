var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// http://mongoosejs.com/docs/2.7.x/docs/populate.html
exports.RoomSchema = Schema({
    coords: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    name: { type: String, required: true },
    university: { type: String, required: true }
    // messages: [ { type: ObjectId, ref: 'Message' } ]
});

// User models are not persistant! They will be created 
// and deleted as users connect & disconnect. This model
// purely exists as a mechanism to reserve names.
exports.UserSchema = Schema({
    name: {
        first: { type: String, trim: true },
        last: { type: String, trim: true }
    }
});

exports.MessageSchema = Schema({
    name: { 
        first: { type: String },
        last: { type: String }
    },  
    roomId: { type: ObjectId, ref: 'Room' }, // Room name
    timestamp: { type: Date, default: Date.now },
    body: String
});

exports.MessageModel = mongoose.model('Message', exports.MessageSchema);
exports.UserModel = mongoose.model('User', exports.UserSchema);
exports.RoomModel = mongoose.model('Room', exports.RoomSchema);


