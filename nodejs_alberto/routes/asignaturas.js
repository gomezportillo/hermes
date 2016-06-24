var Asignatura;
exports.setModelAsignatura = function(modelo){
	Asignatura = modelo;
	console.log('asigno modelo');
};
var Usuario;
exports.setModelUsuario = function(modelo){
	Usuario = modelo;

};
exports.index = function(req, res){
	Asignatura.find({}, function(error, asignaturas){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			res.render('asignaturas/index', {
				asignaturas: asignaturas, req:req
			});
		}
	})
};
exports.create = function(req, res){
	res.render('asignaturas/save', {
		put: false,
		action: '/asignaturas/',
		asignatura: new Asignatura({
			nombre: '',
			informacion: '',
			url_descarga: '',
			alumnos: '',
			profesores:''
		})
	});
};
exports.store = function(req, res){
	console.log('estoy en el store')
	console.log('nombre'+ req.body.nombre);
	console.log('informacion'+ req.body.informacion);
	console.log('url'+ req.body.url_descarga);
	var asignatura = new Asignatura({
		nombre: req.body.nombre,
		informacion: req.body.informacion,
		url_descarga: req.body.url_descarga,
		alumnos: [],
		profesores: []
	});
	asignatura.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar la asignatura.');
		}else{	
			res.redirect('/asignaturas');
		}
	});
};

exports.show = function(req, res){
	
	Asignatura.findById(req.params.id, function(error, asignaturas){
		var arrayalu = [];
		var arrayprof = [];
		var docalu ;
		var docprof ;
		if(error){
			res.send('Error al intentar ver la asignatura.');
		}else{
			for (var i = 0; i < asignaturas.alumnos.length ; i++) {
				Usuario.findById(asignaturas.alumnos[i], function(error, documento){
					if(error){
						res.send('Error al intentar ver la asignatura.');
					}else{
						arrayalu.push(documento);	
					}
				docalu = arrayalu;
				});
				
			};
			for (var i = 0; i < asignaturas.profesores.length ; i++) {
				Usuario.findById(asignaturas.profesores[i], function(error, documento){
					if(error){
						res.send('Error al intentar ver la asignatura.');
					}else{
						arrayprof.push(documento);	
					}
				docprof = arrayprof;
				});
				
			};

			setTimeout(function() {
   				console.log('Blah blah blah blah extra-blah');
   				console.log(docalu);
   				res.render('asignaturas/show', {
   				req: req,
				asignatura: asignaturas,
				docalu:docalu,
				docprof:docprof
			});
			}, 1500);
			

			
		}
	});
};
exports.edit = function(req, res){
	Asignatura.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver la asignatura.');
		}else{
			res.render('asignaturas/save', {
				put: true,
				action: '/asignaturas/' + req.params.id,
				asignatura: documento
			});
		}
	});
};

exports.users = function(req, res){
	Asignatura.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver la asignatura.');
		}else{

			Usuario.find({}, function(error, usuarios){
				if(error){
					res.send('Ha surgido un error.');
				}
				else{
					res.render('asignaturas/users', {
						put: true,
						action: '/asigUsers/' + req.params.id,
						asignatura: documento,
						usuarios:usuarios,
						id:req.params.id
					});
				}
			})
			
		}
	});
};
exports.profesors = function(req, res){
	Asignatura.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver la asignatura.');
		}else{

			Usuario.find({}, function(error, usuarios){
				if(error){
					res.send('Ha surgido un error.');
				}
				else{
					res.render('asignaturas/profesors', {
						put: true,
						action: '/asigProfesors/' + req.params.id,
						asignatura: documento,
						usuarios:usuarios,
						id:req.params.id
					});
				}
			})
			
		}
	});
};
exports.storeusers = function(res, req){
	console.log('storeusers')
	Asignatura.findById(res.session.idAsig, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el asignatura.');
		}else{

			var asignatura = documento;
			asignatura.nombre = documento.nombre;
			asignatura.informacion = documento.informacion;
			asignatura.url_descarga = documento.url_descarga;
			asignatura.alumnos = req.session.arrUsers;
			asignatura.profesores = documento.profesores;
			asignatura.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar la asignatura.');
				}else{	
					res.redirect('/asignaturas');
				}
			});
		}
	});
};
exports.storeprofesors = function(res, req){
	console.log('almacenar users');
	Asignatura.findById(res.session.idAsig, function(error, documento){
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
					res.redirect('/asignaturas');
				}
			});
		}
	});
};


exports.update = function(req, res){
	Asignatura.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el asignatura.');
		}else{
			var asignatura = documento;
			asignatura.nombre = req.body.nombre;
			asignatura.informacion = req.body.informacion;
			asignatura.url_descarga = req.body.url_descarga;
			asignatura.alumnos = documento.alumnos;
			asignatura.profesores = documento.profesores;
			asignatura.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar la asignatura.');
				}else{	
					res.redirect('/asignaturas');
				}
			});
		}
	});
};

exports.destroy = function(req, res){
	Asignatura.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el asignatura.');
		}else{	
			res.redirect('/asignaturas');
		}
	});
};
