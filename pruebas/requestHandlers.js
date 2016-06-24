var exec = require("child_process").exec;
var fs = require("fs");

function subir(response, data) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<p>A ver que foto subimos...</p>");
  response.write("¿Has dicho "+data+"?")
  response.end();
}

function iniciar(response, data) {
  fs.readFile('pages/student.html', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    }
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end()
  });
}


function getFiles(response, data) {
  exec("dir /b", function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<p>Estos son los archivos del servidor:</p>");
    response.write("<p>"+stdout+"</p>");
    response.end();
  });
}

function student(response, data) {}

function professor(response, data) {
  fs.readFile('pages/professor.html', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    }
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end()
  });
}

function notFound(pathname, response) {
  response.writeHead(404, {"Content-Type": "text/html"});
  response.write("<p>404 - No se ha encontrado la ruta. Ir a <a href=/iniciar>inicio</a></p>");
  response.end();
}


exports.iniciar = iniciar;
exports.subir = subir;
exports.getFiles = getFiles;
exports.student = student;
exports.student = professor;
exports.notFound = notFound;
