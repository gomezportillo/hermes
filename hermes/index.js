var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server),
    nicknames = {};

app.use(express.static(__dirname + '/images'));

server.listen(8080);
app.get('/', function(req, res) {
    res.sendfile('hermes/pages/student.html');
});
app.get('/admin', function(req, res) {
    res.sendfile('hermes/pages/professor.html');
});

io.sockets.on('connection', function(socket) {

    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });

    socket.on('new user', function(data, callback) {
        if (data in nicknames) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames[socket.nickname] = 1;
            updateNickNames();
        }
    });

    socket.on('update video', function(data, callback) {
        console.log("VIDEO UPDATED TO " + data + "\n");
    });

    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        delete nicknames[socket.nickname];
        updateNickNames();
    });

    function updateNickNames() {
        io.sockets.emit('usernames', nicknames);
    }
});
