/* routers/com/index.js */
'use strict';
const JSONValidator = require('expressif').JSONValidator;
const Router = require('expressif').Router;
const RX = require('expressif').ReqValidator;
const sc = require('schemas/auth');
const cc = require('controllers/auth');

const AuthRouter = function AuthRouter(auth) {
	let jv = new JSONValidator(sc, { allErrors: true });
	const routes = [
		{
			method: 'post', path: '/login', rprivs: null, mwares: [cc.login],
			rxvalid: RX.NOT_APP_JSON | RX.NOT_ACCEPT_JSON,
			validreq: 'login'
		},
	];
	const router = new Router({}, auth, jv);
	router.addRoutes(routes);
	return router.router;
}

module.exports = AuthRouter;
