var mongoose = require('mongoose');
var expect   = require('chai').expect;

describe('MongoDB', function(){
	var db = null;
	before(function(done){
		mongoose.connect('mongodb://admin:admin@ds063789.mongolab.com:63789/primer_base', function(error){
			if(error){
				throw error;		
			}else{
				console.log('Conectado a MongoDB1');
				db = true;
			}
			done();
		});
	});
	it('Deberia conectarse a MongoDB', function(done){
		mongoose.connection.on('open', function (ref) {
		 	expect(db).to.equal(true);
		});
		mongoose.connection.on('error', function (err) {
		  console.log('Could not connect to mongo server!');
		  console.log(err);
		});
		done();
	});
	it('Cierre de Conexion', function(done){
		mongoose.connection.close();
		expect(true).to.be.true;	
		done();
	});
});