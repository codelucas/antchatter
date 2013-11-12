$(document).ready(function() {
    // var nickname = ''; // We set it above! 
    // var siteIp; var sitePort; var rootUrl;
    var messages = [];
    var socket = io.connect('http://' + siteIp + ':' + sitePort);
    var longitude;
    var latitude;
    var univ = 'No University';
    var $chat = $('#chat');
    var $messageBox = $('#messageBox');
    var $sendButton = $('#sendButton');
    var start = true;

    if (start) {
        socket.emit('login', { nickname: nickname, lng:0, lat:0  }, function(data) {
            $chat.append('<b>ERROR'+data+'</b>'); 
        });
        start = false;
    }
 
    $sendButton.on('click', function () {
        // the function(data) callback only happens if err's occur
        socket.emit('send_message', { message: $messageBox.val() }, function(data) {
            if (data !== undefined)
                displayMsg({ nickname:'error', body:data });
                $chat.append('<b>ERROR '+data+'</b>'); // displayMsg(data);
        });
        $messageBox.val('');
    });

    socket.on('broadcast_msg', function(data) {
        displayMsg(data);
    });

    socket.on('login_ok', function(data) {
        univ = data.univ;
    });

    function displayMsg(data) {
        messages.push(data);
        var html = '';
        for (var i=0; i<messages.length; i++) {
            html += '<b>' + messages[i].nickname + ': </b>';
            html += messages[i].body + '<br />';
        }
        $chat.html(html);
        $chat.scrollTop($chat[0].scrollHeight);
    }

    $messageBox.keyup(function(e) {
        if(e.keyCode == 13) {
            $sendButton.trigger('click');
        }
    });
});
