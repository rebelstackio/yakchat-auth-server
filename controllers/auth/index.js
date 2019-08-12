/* controllers/auth/index.js */
'use strict';
const RESPOND = global.E.Respond;
const User = require('models/user');
const admin = require('firebase-admin');
const adminFile = require('../../firebase-admin.json');
admin.initializeApp({
	credential: admin.credential.cert(adminFile)
}
);
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
	muser.authenticate(un, pa, function(error, data){
		if ( error ) {
			LOGGER.error(error);
			return RESPOND.notAuthorized(
				res,
				req,
				new global.E.Exception.AuthError(error.message)
			);
		} else {
			const userData = {
				"roles": data.roles,
				"displayname": data.displayname,
				"email": data.email
			};
			// ask firebase to create the token
			admin.auth().createCustomToken(data.id, userData)
			.then(function(jwt) {
				// Send token back to client
				res.set('Authorization', jwt);
				let wrapper = RESPOND.wrapSuccessData({
					"message": "You are logged",
				}, path, true);
				return RESPOND.success(res, req, wrapper);
			})
			.catch(function(error) {
				console.log('Error creating custom token:', error);
			});
		}
	});
};

module.exports = {
	login,
	signupoperator,
	signupclient
}
