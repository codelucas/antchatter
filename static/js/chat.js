window.onload = function() {
    var messages = [];
    var socket = io.connect('http://' + site.siteIp + ':' + site.sitePort);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var longitude;
    var latitude;
    var roomName;

    socket.on('login_ok', function(data) {
        var html = ['Welcome to AntChatter'];
        html.push(data.name.first);
        html.push(data.name.last);
        html.push('from');
        html.push(data.roomName+'!');
        html.push('<br />');
        content.innterHTML = html;
        content.scrollTop = content.scrollHeight;
    });
 
    socket.on('broadcast_msg', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
		html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
  	    content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = sendMessage = function() {
        if (name.value == '') {
	    socket.emit('please enter your name!');
	} else {
 	    var text = field.value;
            socket.emit('send', { username: name.value, message: text });
            field.value = '';
        }
    };
 
}

$(document).ready(function() {
    $("#field").keyup(function(e) {
        if(e.keyCode == 13) {
            sendMessage();
        }
    });
});
