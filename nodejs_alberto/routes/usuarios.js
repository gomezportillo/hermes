var Usuario;
exports.setModelUsuario = function(modelo){
	Usuario = modelo;
};

exports.index = function(req, res){
	Usuario.find({}, function(error, usuarios){
		if(error){
			res.send('Ha surgido un error.');
		}else{
				res.render('usuarios/index', {
					usuarios: usuarios,req:req
				});
			}
	})
};
exports.create = function(req, res){
	res.render('usuarios/save', {
		put: false,
		action: '/usuarios/',
		usuario: new Usuario({
			nombre: '',
			dni:'',
			rol:'',
			apellido: '',
			password: '',
			email:''
		})
	});
};
exports.store = function(req, res){
	var usuario = new Usuario({
		nombre: req.body.nombre,
		dni: req.body.dni,
		rol: req.body.rol,
		apellido: req.body.apellido,
		password: req.body.password,
		email: req.body.email
	});
	usuario.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar el usuario.');
		}else{	
			res.redirect('/usuarios');
		}
	});
};
exports.show = function(req, res){
	Usuario.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el usuario.');
		}else{
			res.render('usuarios/show', {
				usuario: documento
			});
		}
	});
};
exports.edit = function(req, res){
	Usuario.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el usuario.');
		}else{
			res.render('usuarios/save', {
				put: true,
				action: '/usuarios/' + req.params.id,
				usuario: documento
			});
		}
	});
};
exports.update = function(req, res){
	Usuario.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el usuario.');
		}else{
			var usuario = documento;
			usuario.nombre = req.body.nombre;
			usuario.apellido = req.body.apellido;
			usuario.dni = req.body.dni;
			usuario.rol = req.body.rol;
			usuario.password = req.body.password;
			usuario.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar el usuario.');
				}else{
					console.log(documento);
					res.redirect('/usuarios');
				}
			});
		}
	});
};
exports.destroy = function(req, res){
	Usuario.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el usuario.');
		}else{	
			res.redirect('/usuarios');
		}
	});
};
