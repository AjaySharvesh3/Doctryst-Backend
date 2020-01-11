const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function (app) {

	const controller = require('../controller/controller.js');

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
		next();
	});

	app.post('/doctryst/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

	app.post('/doctryst/api/auth/signin', controller.signin);

	app.get('/doctryst/api/test/user', [authJwt.verifyToken], controller.userContent);

	app.get('/doctryst/api/test/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], controller.managementBoard);

	app.get('/doctryst/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
}
