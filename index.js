var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var fs = require('fs');
const _PORT = 8080;
const _professor_nickname = '¬HERMES:professor';
const _BASE_VIDEO = "https://youtube.com/embed/FBBn72oY8nc";
var youtube_video = _BASE_VIDEO
var professor_connected = false;
var blocked_users = {};
var connected_users = {};
var registered_users = {};

app.use(express.static(__dirname + '/images'));

server.listen(_PORT);

app.get('/', function(req, res) {
    res.sendfile('pages/student.html');
});

app.get('/admin', function(req, res) {
    res.sendfile('pages/professor.html');
});

app.get('*', function(req, res) {
    res.sendfile('pages/404.html');
});

io.sockets.on('connection', function(socket) {

    socket.on('send message', function(data) {
        if (connected_users[socket.nickname] || socket.nickname == _professor_nickname) { //si el usuario que MANDA está conectado
            var sender_name = socket.nickname;
            io.sockets.clients().forEach(function (socket) {
                if (connected_users[socket.nickname] || socket.nickname == _professor_nickname) { //si el usuario que RECIBE está conectado
                    socket.emit('new message', {msg: data, nick: sender_name});
                }
            });
        }
    });

    socket.on('new user', function(user, password, callback) {
        load_csv_users_file();

        if (connected_users[user]) { //si el estudiante ya está conectado
            callback(false, "Ya hay un usuario con estas credenciales conectado.");

        } else if (registered_users[user] == password) { //si nombre y contraseña coinciden

            if (blocked_users[user]) { //si el estudiante ha sido bloqueado
                callback(false, "Error al intentar conectar. El docente le ha bloqueado.");

            } else {
                socket.nickname = user;
                connected_users[socket.nickname] = true;
                callback(true, "Usuario y contraseña conrrectos.");
                socket.emit('update url', youtube_video);
                announce_users();
            }

        } else {
            callback(false, "Usuario o contraseña incorrecta. Por favor inténtelo de nuevo.");
        }
    });

    socket.on('log professor', function(password, callback) {
        if (professor_connected) {
            callback(false, "Ya hay un profesor conectado. Espere a que acabe su sesión.")
        }
        if (password == 'cted') {
            professor_connected = true;
            socket.nickname = _professor_nickname;
            socket.emit('user connected', connected_users);
            callback(true, "Success");
        } else {
            callback(false, "La contraseña no es correcta.");
        }
    });

    socket.on('update video', function(url, callback) {
        if (socket.nickname == _professor_nickname) {
            var url_base = "https://youtube.com/embed/";
            var url_id = get_video_id(url);

            if (typeof url_id == 'undefined' || url_id.length != 11) {
                callback(false, "La URL no es correcta. Por favor introduzca una URL correcta.");
            } else {
                youtube_video = url_base + url_id;

                io.sockets.clients().forEach(function (socket) {
                    if (connected_users[socket.nickname]) { //si el usuario que recibe está conectado
                        socket.emit('update url', youtube_video);
                    }
                });
                callback(true, "Success");
            }
        }
    });

    socket.on('kick user', function(username, callback) {
        if (socket.nickname == _professor_nickname) {
            io.sockets.clients().forEach(function (socket) {
                if (socket.nickname == username) {
                    socket.emit('being kicked');
                    blocked_users[username] = true;
                    delete connected_users[socket.nickname];
                    announce_users();
                }
            });
        } else {
            callback("No se ha podido expulsar a " + username)
        }
    });

    socket.on('disconnect', function(data) {
        if (socket.nickname == _professor_nickname) {
            professor_connected = false;
            youtube_video = _BASE_VIDEO;
            blocked_users = {}; //todos los usuarios que hubieran sido bloqueados por el antrerior docente se desbloquean
        } else if (connected_users[socket.nickname]) {
            delete connected_users[socket.nickname];
            announce_users();
        }
    });

    function announce_users(){
        io.sockets.clients().forEach(function (socket) {
            if (connected_users[socket.nickname] || socket.nickname == _professor_nickname) { //si el usuario que recibe está conectado
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

    function get_video_id(url) {
        var url_id = '';
        try {
            url_id = url.split("v=")[1].split("&")[0];
        } catch (ex) {
            return;
        }
        return url_id;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
