var Usuario;
exports.setModelUsuario = function(modelo){
	Usuario = modelo;
};
exports.index = function(req, res){
  res.render('login');
};

exports.main_page = function(req, res) {
	console.log(req.session.listaAsignaturas);
	res.render('main_page',{req:req});
};

exports.asignaturas = function(req, res) {
	res.render('asignaturas',{req:req});
};

exports.help = function(req, res) {
	Usuario.find({}, function(error, usuarios){
		if(error){
			res.send('Ha surgido un error.');
		}
		else{
			res.render('help',{req:req, usuarios:usuarios});
		}
	})
	
};
