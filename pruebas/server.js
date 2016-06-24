var http = require("http");
var url = require("url");

function iniciar(route) {

  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    if(pathname != "/favicon.ico") {

      var data = "";

      request.setEncoding("utf-8");
      request.addListener("data", function(chunck) {
        data += chunck;
      });

      request.addListener("end", function() {
        route(pathname, response, data);
      });
    }
  }

  http.createServer(onRequest).listen(8888);
  console.log("Servidor iniciado");

}

exports.iniciar = iniciar;


//http://www.nodebeginner.org/index-es.html
