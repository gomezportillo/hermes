var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var fs = require('fs');
var nicknames = {};


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

    socket.on('log in', function(password, callback) {
        console.log("Intentando acceder con la contraseña" + password);
        if (password == 'cted') {
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on('update video', function(url, callback) {
        url = splitURL(url);
        if (typeof url != 'undefined') {
            updateWebPage(url);
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        delete nicknames[socket.nickname];
        updateNickNames();
    });

    function updateNickNames() {
        io.sockets.emit('usernames', nicknames);
    }

    function splitURL(url) {
        return url.split("v=")[1]
    }

    function updateWebPage(newURL) {
        fs.readFile('hermes/pages/student_template.html', 'utf-8', function(err, data){
            if (err) throw err;

            var new_file = data.replace('$VIDEO_URL', newURL);

            fs.writeFile('hermes/pages/student.html', new_file, 'utf-8', function (err) {
                if (err) throw err;
                console.log('Updated URL ' + newURL);
            });
        });
    }
});
