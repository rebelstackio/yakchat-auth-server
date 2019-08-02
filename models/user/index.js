/* models/user/index.js */
'use strict';

const fs = require('fs');
const file = '/var/tmp/yakchat.users.json';

const {ExpError, EXPRESSIF_HTTP_CODES, EXPRESSIF_HTTP_TYPES} = require('@rebelstack-io/expressif')

function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		 result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


class UserModel {

	constructor(){
	}

	authenticate(email, password, next) {
		const db = require(file);
		const exists = db.users.filter(u => u.email == email && u.password === password);
		if ( exists.length ) {
			const roles  = exists[0].roles;
			return next(null, roles);
		} else {
			const err = new ExpError(EXPRESSIF_HTTP_TYPES.unauthorized, EXPRESSIF_HTTP_CODES.unauthorized, `Invalid credententials`)
			err.code = EXPRESSIF_HTTP_TYPES.unauthorized;
			return next(err);
		}
	}

	signup(body, role, next) {
		try {
			const newuser = Object.assign({id: makeid(10)}, body, {roles : [ role ]});
			const db = require(file);
			const taken = db.users.filter(u => u.email == newuser.email || u.displayname === newuser.displayname);
			if ( taken.length ){
				const err = new ExpError(EXPRESSIF_HTTP_TYPES.conflict, EXPRESSIF_HTTP_CODES.conflict, `Email or displayname already taken`)
				err.code = EXPRESSIF_HTTP_TYPES.conflict;
				return next(err);
			} else {
				db.users.push(newuser);
				fs.writeFile(file, JSON.stringify(db), ( err ) => {
					if ( err ) {
						return next(err);
					} else {
						return next(null);
					}
				});
			}
		} catch (error) {
			return next(error);
		}
	}
}

module.exports =  UserModel;
