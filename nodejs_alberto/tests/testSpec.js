var should = require("chai").should();
var usuario = require("../routes/usuarios.js");
var asignatura = require("../routes/asignaturas.js"); 
var mongoose = require('mongoose');
var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session')

var app = express();



app.set('port', process.env.PORT || 3000);
/*var mongoose        = require('mongoose');
var db_lnk          = 'mongodb://admin:admin@ds063789.mongolab.com:63789/primer_base';
var db              = mongoose.connect(db_lnk);*/
//console.log(db);
mongoose.connect('mongodb://admin:admin@ds063789.mongolab.com:63789/primer_base', function(error){
	if(error){
		throw error;		
	}else{
		console.log('Conectado a MongoDB');
	}
});
/*db = require('mongoose').connection;
db.on('error', function(err){
  return console.log("uncaught error: "+ err);
});*/

/*db.on('open', function(err){
  console.log("conected to test db");
  //defining schema
  
  });*/

console.log('Welcome to My Console,');
setTimeout(function() {
    console.log('Blah blah blah blah extra-blah');
    describe ("Creacion Usuarios y Asignaturas", function(){
	it("Deberia crear un usuario", function(){
		var UsuarioSchema = mongoose.Schema({
			nombre: {type: String, required: true},
		 	dni: {type: String, required: true , index: { unique: true }},
		  	rol: {type: String, required: true},
			apellido: {type: String, required: true},
			password: {type: String, required: true},
			email: {type: String, required: true},
		});
		var UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
		var usua = new UsuarioModel({
			nombre: 'Ruben',
			dni:'123456789L',
			rol:'profesor',
			apellido:'de la Cruz',
			password:'admin',
			email:'ruben@gmail.com'
		});

		usua.save(function(error, documento){
			if(error){
				res.send('Error al intentar guardar el usuario.');
			}
		});

	})
	/*it("Deberia crear una asignatura", function(){
	})*/
})
}, 3000);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});