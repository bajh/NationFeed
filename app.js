var app = require('express')(),
    express = require('express'),
    port = process.env.PORT || 3000,
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

http.listen(port, function(){});