var mongoose = require('mongoose');
var asignatura = require("../routes/asignaturas.js");
var Schema = require('mongoose').Schema;
var expect = require('chai').expect;
var should = require('chai').should;
mongoose.connect('mongodb://admin:admin@ds063789.mongolab.com:63789/primer_base');

var AsignaturaShema = new Schema({
	nombre: {type: String, required: true, index: {unique: true}},
	informacion: {type: String, required: true},
	url_descarga: {type: String, required: true},
  	alumnos: [],
  	profesores: [],
});
var AsignaturaModel = mongoose.model('asignatura', AsignaturaShema);

describe("Asignatura", function(){
	var currentAsignatura = null;
	beforeEach(function(done){
		//añadimos algun dato de prueba.
		currentAsignatura = new AsignaturaModel({
			nombre: 'Utopia',
			informacion: '...',
			url_descarga: 'aad.com',
			alumnos: [],
			profesores: [],	
		});
		currentAsignatura1 = new AsignaturaModel({
			nombre: 'Utopia1',
			informacion: '...',
			url_descarga: 'aad.com',
			alumnos: [],
			profesores: [],	
		});
		currentAsignatura.save(function(error, documento){
			
		});
		currentAsignatura1.save(function(error, documento){

		});
		done();
	});
	
	it("Crear una nueva asignatura", function(done){
		var asig = new AsignaturaModel({
			nombre: 'Cafe',
			informacion: '...',
			url_descarga: 'cafe.com',
			alumnos: [],
			profesores: [],
		});
		asig.save(function(error, documento){
			expect(documento.nombre).to.equal("Cafe");
			done();
		});
			
	});
	it("Actualizar una asignatura", function(done){
		var subj = currentAsignatura;
		subj.nombre = 'NoUtopia',
		subj.informacion = 'Error404',
		subj.url_descarga = 'errores.com',
		subj.alumnos = [],
		subj.profesores = []
		subj.save(function(error, documento){
			expect(documento.nombre).to.equal("NoUtopia");
			done();
		});
	});
	it("Leer una asignatura", function(done){
		AsignaturaModel.find({nombre:'Utopia'}, function(error, documento){
			var find = documento;
			expect(documento.nombre).to.equal(find.nombre);
			expect(documento.informacion).to.equal(find.informacion);
			expect(documento.url_descarga).to.equal(find.url_descarga);
			expect(documento.alumnos).to.equal(find.alumnos);
			done();
		});
	});
	it("Borrar una asignatura", function(done){
		var subject = new AsignaturaModel({
			nombre: 'Procesos',
			informacion:'Se hacen cosas',
			url_descarga:'www.moodle.com/Procesos',
			alumnos:[],
			profesores:[],
		});
		subject.save(function(error, documento){
			expect(documento.nombre).to.equal("Procesos");
			AsignaturaModel.remove({_id:documento.id}, function(error){
				expect(error).to.equal(null);
				done();
			});
		});
	});
	it("Comprobar que dos Asignaturas no se llamen igual", function(done){
		AsignaturaModel.findOne({nombre:'Utopia1'}, function(error, documento){
			AsignaturaModel.findOne({nombre:'Utopia'}, function(error, documento1){
				expect(documento.nombre).to.not.equal(documento1.nombre);
				done();
			});
		});
	});
	it("Añadir una url o app a la asignatura", function(done){
		var asigurl = new AsignaturaModel({
			nombre: 'Calculo',
			informacion: 'Se da Calculo',
			url_descarga: 'http://www.moodle.com/asignatura/Calculo',
			alumnos: [],
			profesores: [],	
		});
		asigurl.save(function(error, documento){
			expect(documento.url_descarga).to.exist;
			AsignaturaModel.remove({_id:documento.id}, function(error){
				expect(error).to.equal(null);
				done();
			});
		});
	});
	it("Añadir y consultar la informacion de una Asignatura", function(done){
		var asigprueba = new AsignaturaModel({
			nombre: 'Fisica',
			informacion:'En esta asignatura se impartiran temas sobre termodinamica',
			url_descarga:'http://www.fisica.com',
			alumnos:[],
			profesores:[],
		});
		expect(asigprueba).to.exist;
		asigprueba.save(function(error, documento){
			expect(documento.nombre).to.equal("Fisica");
			AsignaturaModel.findOne({_id:documento.id}, function(error, doc1){
				expect(doc1.informacion).to.equal('En esta asignatura se impartiran temas sobre termodinamica');
				AsignaturaModel.remove({_id: doc1.id}, function(error){
					done();	
				});
			});
		});
	});
	it("Actualizar la informacion de una Asignatura", function(done){
		AsignaturaModel.findOne({nombre: 'Utopia'}, function(err, doc){
			doc.informacion='Utopia mola mogollon';
			doc.save();
			expect(doc.informacion).to.equal('Utopia mola mogollon');
			done();
		});
	});
	afterEach(function(done){
		AsignaturaModel.remove({nombre:'Cafe'}, function(){
		});
		AsignaturaModel.remove({nombre:'NoUtopia'}, function(){
		});
		done();
	});

});

