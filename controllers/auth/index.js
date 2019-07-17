/* controllers/auth/index.js */
'use strict';
const RESPOND = global.E.Respond;
const User = require('models/user');
const muser = new User();

const signupoperator = function _signupoperator(req, res) {
	return signup( req, res, 'operator')
};

const signupclient = function _signupclient(req, res) {
	return signup( req, res, 'client')
};

/**
 * Generic signup controller for a target role
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {string} role Role
 */
const signup = function _signup(req, res, role) {
	const path = req.path;
	muser.signup(req.body, role, (err) => {
		if ( err ) {
			LOGGER.error(err);
			return RESPOND.dbError(
				res,
				req,
				err
			);
		} else {
			let wrapper = RESPOND.wrapSuccessData({
				"message": "You are successfully created your account",
			}, path, true);
			return RESPOND.success(res, req, wrapper);
		}
	});
};

const login = function login(req, res) {
	const path = req.path;
	const un = req.body.email;
	const pa = req.body.password;
	muser.authenticate(un, pa, function(error, roles){
		if ( error ) {
			LOGGER.error(error);
			return RESPOND.notAuthorized(
				res,
				req,
				new global.E.Exception.AuthError(error.message)
			);
		} else {
			const userData = {
				"roles": roles
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
	login,
	signupoperator,
	signupclient
}
