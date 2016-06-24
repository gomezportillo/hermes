var mongoose = require('mongoose');
var usuario = require("../routes/usuarios.js");
var Schema = require('mongoose').Schema;
var expect   = require('chai').expect;
var should = require('chai').should;
mongoose.connect('mongodb://admin:admin@ds063789.mongolab.com:63789/primer_base');

var customerShema = new Schema({
	nombre: {type: String, required: true},
	dni: {type: String, required: true , index: { unique: true }},
	rol: {type: String, required: true},
	apellido: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
});
var UsuarioModel = mongoose.model('usuario', customerShema);
describe("Usuarios", function(){
	var currentUsuario = null;
	beforeEach(function(done){
		//añadimos algun dato de prueba.
		currentUsuario = new UsuarioModel({
			nombre: 'pepe',
			dni:'123789456',
			rol:'profesor',
			apellido:'pepito',
			password:'admin',
			email:'adios@gmail.com'	
		});
		currentUsuario.save(function(error, documento){
			done();
		});
	});
	
	it("Crear un nuevo usuario", function(done){
		var usua = new UsuarioModel({
			nombre: 'pepito',
			dni:'123123123',
			rol:'alumno',
			apellido:'grillo',
			password:'hola',
			email:'pepito@gmail.com',
		});
		usua.save(function(error, documento){
			expect(documento.nombre).to.equal("pepito");
			done();
		});
			
	});
	it("Actualizar un usuario", function(done){
		var user = currentUsuario;
		user.nombre = 'DROMEDARIO',
		user.dni = '123789456',
		user.rol = 'ALUMNO',
		user.apellido = 'pepito',
		user.password = 'admin',
		user.email = 'adios@gmail.com'
		user.save(function(error, documento){
			expect(documento.nombre).to.equal("DROMEDARIO");
			done();
		});
	});
	it("Leer un usuario", function(done){
		UsuarioModel.findOne({dni:'123789456'}, function(error, documento){
			expect(documento.nombre).to.equal('pepe');
			expect(documento.rol).to.equal('profesor');
			expect(documento.apellido).to.equal('pepito');
			expect(documento.password).to.equal('admin');
			expect(documento.email).to.equal('adios@gmail.com');
			done();
		});
	});
	it("Borrar un usuario", function(done){
		var usuario1 = new UsuarioModel({
			nombre: 'castor',
			dni:'000111222',
			rol:'alumno',
			apellido:'pollo',
			password:'hola',
			email:'castor@gmail.com',
		});
		usuario1.save(function(error, documento){
			expect(documento.nombre).to.equal("castor");
			UsuarioModel.remove({dni:'000111222'}, function(error){
				expect(error).to.equal(null);
				done();
			});
		});
	});
	it("Comprobar rol del usuario admin", function(done){
		UsuarioModel.findOne({rol:'admin'}, function(error, documento){
			expect(documento.rol).to.equal('admin');
			done();
		});	
		
	});
	it("Comprobar rol del usuario profesor", function(done){
		UsuarioModel.findOne({rol:'profesor'}, function(error, documento){
			expect(documento.rol).to.equal('profesor');
			done();
		});	
	});
	it("Comprobar rol del usuario alumno", function(done){
		UsuarioModel.findOne({rol:'alumno'}, function(error, documento){
			expect(documento.rol).to.equal('alumno');
			done();
		});	
		
	});
	it("Comprobar que dos DNIs no son iguales", function(done){
		UsuarioModel.findOne({dni:'123456789'},function(error, documento){
			UsuarioModel.findOne({dni:'1234'},function(error, documento1){
				expect(documento.dni).to.not.equal(documento1.dni);
				done();
			});
		});
		
	});
	afterEach(function(done){
		UsuarioModel.remove({dni:'123789456'}, function(){
		});
		UsuarioModel.remove({dni:'123123123'}, function(){
		});
		done();
	});

});