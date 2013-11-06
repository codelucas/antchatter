// BE SURE TO USE 2 SPACE INDENTING, NO TABS.

// Let's kill this guys ;) 
// - Lucas

var express = require("express");
var app = express();
var port = 20069;
app.get("/", function(req, res) {
  res.send("Testing chat");
});

app.listen(port);
console.log("Listening on port " + port);

/* Outdated, we now use express framework
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(20069);
*/
