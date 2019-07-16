/* controllers/auth/index.js */
'use strict';
const RESPOND = global.E.Respond;
const User = require('models/user');
const muser = new User();

/**
 * Authenticate endpoint
 * @param {*} req
 * @param {*} res
 */
const login = function login(req, res) {
	const path = req.path;
	const un = req.body.username;
	const pa = req.body.password;
	muser.authenticate(un, pa, function(error, adgroups){
		if ( error ) {
			LOGGER.error(error);
			return RESPOND.notAuthorized(
				res,
				req,
				new global.E.Exception.AuthError(error.message)
			);
		} else {
			const userData = {
				"privileges": ""
			};
			const jwt = E.Auth.encodeJWT(userData, process.env.JWT_SECRET);
			res.set('Authorization', jwt);
			let wrapper = RESPOND.wrapSuccessData({
				"message": "You are logged",
			}, path, true);
			return RESPOND.success(res, req, wrapper);
		}
	});
};

module.exports = {
	login
}
