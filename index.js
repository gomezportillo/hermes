var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var fs = require('fs');
var connected_users = {};
var registered_users = {};


app.use(express.static(__dirname + '/images'));

server.listen(8080);

app.get('/', function(req, res) {
    res.sendfile('pages/student.html');
});

app.get('/admin', function(req, res) {
    res.sendfile('pages/professor.html');
});

io.sockets.on('connection', function(socket) {

    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });

    socket.on('new user', function(user, password, callback) {
        if (user in connected_users) { //si el estudiante ya está conectado
            callback(false);
        } else {
            read_registered_users();
            console.log(user);
            console.log(password);
            if (user in registered_users && registered_users[user] == password) { //si nombre y contraseña coinciden
                callback(true);
                socket.nickname = user;
                connected_users[socket.nickname] = 'connected';
                update_users();
            } else {
                callback(false);
            }
        }
    });

    socket.on('log professor', function(password, callback) {
        console.log("Profesor intentando acceder con la contraseña " + password);
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
        delete connected_users[socket.nickname];
        update_users();
    });

    function update_users() {
        io.sockets.emit('usernames', connected_users);
    }

    function splitURL(url) {
        return url.split("v=")[1]
    }

    function updateWebPage(newURL) {
        fs.readFile('pages/student_template.html', 'utf-8', function(err, data){
            if (err) throw err;

            var new_file = data.replace('$VIDEO_URL', newURL);

            fs.writeFile('pages/student.html', new_file, 'utf-8', function (err) {
                if (err) throw err;
                console.log('Updated URL ' + newURL);
            });
        });
    }

    function read_registered_users() {
        fs.readFile('users.csv', 'utf-8', function(err, data) {
            if (err) throw err;

            var array = data.split('\n');
            array.forEach(function(item) {
                var splitted_item = item.split(';');
                if (splitted_item != '') {
                    registered_users[splitted_item[0]] = splitted_item[1].split('\r')[0];
                }
            });
        });
        console.log(registered_users);
    }
});
