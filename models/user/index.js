/* models/user/index.js */
'use strict';

class UserModel {

	constructor(){
	}

	authenticate(username, password, next){
		if ( !username ) {
			throw new TypeError('Parameter \'username\' is required');
		}

		if (!password) {
			throw new TypeError('Parameter \'password\' is required');
		}

		return next(null, {ok: true});
	}
}

module.exports =  UserModel;
