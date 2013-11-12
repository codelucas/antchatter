
console.log('starting test');

var mongoose = require('mongoose');
var UserModel = require('./models').UserModel;
var RoomModel = require('./models').RoomModel;
var settings = require('./settings');

var passw = settings.dbPassWord;
var usern = settings.dbUserName;
var dbPort = settings.dbPort;

// The following line persists a connection with mongo
// so our code does not terminate
mongoose.connect('mongodb://'+usern+':'+passw+'@localhost:'+dbPort);

//RoomModel.collection.drop();

RoomModel.count({}, function(err, cnt) {
    if (err) {
        console.log(err);
    } else if (cnt < 1) {
        var heaven = RoomModel();
        heaven.coords.longitude = 0;
        heaven.coords.latitude = 0;
        heaven.name = 'Heaven';
        heaven.university = 'University of Heaven';
        heaven.save(function(err, heaven) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('We just saved a model '+heaven.name);
        });
        // console.log('We have ' + cnt + ' rooms');
        // console.log('typeof '+(typeof cnt));
    } else {
        console.log('We have '+cnt+' rooms');
    }
});

// This gets called way before the above script
console.log('what now?');

