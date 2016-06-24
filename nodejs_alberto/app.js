/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var usuarios = require('./routes/usuarios');
var index = require('./routes/index');
var asignaturas = require('./routes/asignaturas');
var asignaturas1 = require('./routes/asignaturas');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({ secret: 'abcd1234'}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//BB de usuarios

mongoose.connect('mongodb://admin:admin@ds063789.mongolab.com:63789/primer_base', function(error){
	if(error){
		throw error;		
	}else{
		console.log('Conectado a MongoDB');
	}
});
//var db = mongoose.connection;

var UsuarioSchema = mongoose.Schema({
	nombre: {type: String, required: true},
  dni: {type: String, required: true , index: { unique: true }},
  rol: {type: String, required: true},
	apellido: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
});
var UsuarioModel = mongoose.model('usuario', UsuarioSchema);
usuarios.setModelUsuario(UsuarioModel);
index.setModelUsuario(UsuarioModel);
asignaturas.setModelUsuario(UsuarioModel);
//BBDD asignaturas
var AsignaturaSchema = mongoose.Schema({
	nombre: {type: String, required: true},
	informacion: {type: String, required: true},
	url_descarga: {type: String, required: true},
  alumnos: [],
  profesores: []
  //alumnos: {type: String, required: true},
  //profesores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usuario'}]
});
var AsignaturaModel = mongoose.model('asignatura', AsignaturaSchema);
asignaturas.setModelAsignatura(AsignaturaModel);



app.get('/', routes.index);
app.get('/users', user.list);
app.get('/principal', checkAuth, routes.main_page);
app.get('/help', checkAuth, routes.help);
app.get('/login', function (req, res){
  req.session.nombre = null;
  req.session.password = null;
  res.redirect('/');
});


app.post('/asigProfesors/:id', function(req, res) {
  //console.log(req.body);
  if(checkAuth){
  var locks = req.body;
  var arr = Object.keys(locks);
  var id = req.params.id;
  //console.log(arr);
  console.log(req.params.id);
  res.redirect('/asignaturas');
 
  req.session.arrProfesors = arr;
  req.session.idAsig = id;

  AsignaturaModel.findById(id, function(error, documento){
    if(error){
      res.send('Error al intentar modificar el asignatura.');
    }else{

      var asignatura = documento;
      asignatura.nombre = documento.nombre;
      asignatura.informacion = documento.informacion;
      asignatura.url_descarga = documento.url_descarga;
      asignatura.alumnos = documento.alumnos;
      asignatura.profesores = req.session.arrProfesors;
      asignatura.save(function(error, documento){
        if(error){
          res.send('Error al intentar guardar la asignatura.');
        }else{  
          //res.redirect('/asignaturas');
        }
      });
    }
  });
  
  }
});


//rutas usuarios
app.get('/usuarios', checkAuth, usuarios.index);
app.get('/usuarios/create', checkAuth,  usuarios.create);
app.post('/usuarios',  checkAuth, usuarios.store);

app.get('/usuarios/:id',  checkAuth, usuarios.show);
app.get('/usuarios/:id/edit',  checkAuth, usuarios.edit);

app.put('/usuarios/:id',  checkAuth, usuarios.update);
app.delete('/usuarios/:id',  checkAuth,usuarios.destroy);

//rutas asignaturas
app.get('/asignaturas', checkAuth, asignaturas.index);
app.get('/asignaturas/create', checkAuth, asignaturas.create);
app.post('/asignaturas', checkAuth, asignaturas.store);
//app.post('/asigUsers/:id',  checkAuth, usuarios.store_users);
app.get('/asignaturas/:id',  checkAuth, asignaturas.show);
app.get('/asignaturas/:id/edit',  checkAuth, asignaturas.edit);
app.get('/asignaturas/:id/users',  checkAuth, asignaturas.users);
app.get('/asignaturas/:id/profesors',  checkAuth, asignaturas.profesors);
app.put('/asignaturas/:id', checkAuth, asignaturas.update);
app.delete('/asignaturas/:id',  checkAuth, asignaturas.destroy);

//login
app.post('/login', function (req, res, next){
	var post = req.body;

  UsuarioModel.findOne( { $and: [{dni: post.dni},{password: post.password}]},function (e,results) {

    	if(!results) {
        console.log(e);
    		console.log('Usuario no encontrado');
        res.redirect('/');
      }
    	else {
        req.session.identificador = results._id;
        req.session.asig = '';
        req.session.dni = post.dni;
    		req.session.nombre = results.nombre;
    		req.session.password = post.password;
        req.session.rol = results.rol;

        console.log(req.session.identificador);
        var asigid = req.session.identificador.toString();
        console.log(asigid);
        AsignaturaModel.find( { alumnos: asigid },function (e,results) {
          if(!results) {
            console.log(e);
          }
          else{
            //console.log(results);
            req.session.listaAsignaturas = results;
            if(req.session.rol=="admin" || req.session.rol=="profesor")
              res.redirect('/usuarios');
            else if (req.session.rol=="alumno"){
              res.redirect('/principal');
            } else {
              res.redirect('/login');
            }
          }
        });
    	}
    });
});

app.post('/asigUsers/:id', function (req, res, asignaturas){
  if(checkAuth){
    var locks = req.body;
    var arr = Object.keys(locks);
    req.session.arrUsers = arr;
    var id = req.params.id;
    req.session.idAsig = id;
    res.redirect('/asignaturas');
    console.log(id);

    AsignaturaModel.findById(id, function(error, documento){
      if(error){
        res.send('Error al intentar modificar el asignatura.');
      }else{
        console.log('entra');
        var asignatura = documento;
        console.log(documento);
        asignatura.nombre = documento.nombre;
        asignatura.informacion = documento.informacion;
        asignatura.url_descarga = documento.url_descarga;
        asignatura.alumnos = req.session.arrUsers;
        asignatura.profesores = documento.profesores;
        asignatura.save(function(error, documento){
          if(error){
            res.send('Error al intentar guardar la asignatura.');
          }else{  
            //res.redirect('/asignaturas');
          }
        });
      }
    });
    //asignaturas.storeusers;
  }
});
function checkAuth(req, res, next) {
  //Comprobar sesion abierta con usuario legitimo. 
  if (!req.session.dni) {
    res.redirect('/login');
  } else {
    next();
  }
};

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});