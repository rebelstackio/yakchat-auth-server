/* routers/com/index.js */
'use strict';
const JSONValidator = require('@rebelstack-io/expressif').JSONValidator;
const Router = require('@rebelstack-io/expressif').Router;
const RX = require('@rebelstack-io/expressif').ReqValidator;
const sc = require('schemas/auth');
const cc = require('controllers/auth');

const AuthRouter = function AuthRouter(auth) {
	let jv = new JSONValidator(sc, { allErrors: true, jsonPointers: true });
	const routes = [
		{
			method: 'post', path: '/login', rprivs: null, mwares: [cc.login],
			rxvalid: RX.NOT_APP_JSON | RX.NOT_ACCEPT_JSON,
			validreq: 'login'
		},
		{
			method: 'post', path: '/signup/operator', rprivs: null, mwares: [ cc.signupoperator ],
			rxvalid: RX.NOT_APP_JSON | RX.NOT_ACCEPT_JSON,
			validreq: 'signupoperator'
		},
		{
			method: 'post', path: '/signup/client', rprivs: null, mwares: [ cc.signupclient ],
			rxvalid: RX.NOT_APP_JSON | RX.NOT_ACCEPT_JSON,
			validreq: 'signupclient'
		},
	];
	const router = new Router({}, auth, jv);
	router.addRoutes(routes);
	return router.router;
}

module.exports = AuthRouter;
