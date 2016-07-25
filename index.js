var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var fs = require('fs');
var connected_users = {};
var registered_users = {};
var professor_nickname = '¬HERMES:professor'


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
        if (connected_users[socket.nickname] == true || socket.nickname == professor_nickname) { //si el usuario que manda está conectado
            var sender_name = socket.nickname;

            io.sockets.clients().forEach(function (socket) {
                if (connected_users[socket.nickname] == true || socket.nickname == professor_nickname) { //si el usuario que recibe está conectado
                    socket.emit('new message', {msg: data, nick: sender_name});
                }
            });
        }
    });

    socket.on('new user', function(user, password, callback) {
        if (connected_users[user] = true) { //si el estudiante ya está conectado
            callback(false);
        } else {
            load_csv_users_file();
            if (registered_users[user] == password) { //si nombre y contraseña coinciden
                socket.nickname = capitalizeFirstLetter(user);
                connected_users[socket.nickname] = true;
                announce_users();
                callback(true);
            } else {
                callback(false);
            }
        }
    });

    socket.on('log professor', function(password, callback) {
        if (password == 'cted') {
            socket.nickname = professor_nickname;
            announce_users();
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on('update video', function(url, callback) {
        var correct = '';
        try {
            correct = updateWebPage(url);
        } catch (ex) {
            console.log("Error actualizando la URL en las página del alumno.");
            correct = false;
        }
        callback(correct);
    });

    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        delete connected_users[socket.nickname];
        callback(true);
        announce_users();
    });

    function updateWebPage(newURL) {
        newURL = splitURL(newURL);
        if (typeof url != 'undefined') {

            fs.readFile('pages/student_template.html', 'utf-8', function(err, data){
                if (err) throw err;

                var new_file = data.replace('$VIDEO_URL', newURL);

                fs.writeFile('pages/student.html', new_file, 'utf-8', function (err) {
                    if (err) throw err;

                    console.log('Updated URL ' + newURL);
                    return true;
                });
            });
        } else {
            return false;
        }
    }

    function announce_users(){
        io.sockets.clients().forEach(function (socket) {
            if (connected_users[socket.nickname] == true) { //si el usuario que recibe está conectado
                socket.emit('user connected', connected_users);
            }
        });
    }

    function load_csv_users_file() {
        fs.readFile('users.csv', 'utf-8', function(err, data) {
            if (err) throw err;

            var array = data.split('\n');
            array.forEach(function(item) {
                var splitted_item = item.split(';');
                if (splitted_item != '') {
                    registered_users[splitted_item[0]] = splitted_item[1].split('\r')[0]; //all_users[user] = password
                }
            });
        });
    }

    function splitURL(url) {
        return url.split("v=")[1]
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
