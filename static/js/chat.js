window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://75.126.29.133:20069');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
 
    socket.on('message', function (data) {
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
