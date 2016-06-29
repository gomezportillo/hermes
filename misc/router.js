var requestHandlers = require("./requestHandlers");
var handle = {}

handle["/"] = requestHandlers.iniciar;
handle["/iniciar"] = requestHandlers.iniciar;
handle["/subir"] = requestHandlers.subir;
handle["/getFiles"] = requestHandlers.getFiles;

function route(pathname, response, data)
{
  console.log("Recibida peticion para " + pathname)

  if (typeof handle[pathname] === 'function')
  {
    console.log("Data received " + data);
    handle[pathname](response, data)
  } else
  {
    requestHandlers.notFound(pathname, response)
  }

}

exports.route = route;
