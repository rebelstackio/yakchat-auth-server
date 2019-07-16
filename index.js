/* index.js */

require('dotenv').config();
require('app-module-path').addPath(__dirname);
const pjson = require('./package.json');

global.E = require('expressif');
// global.db = new E.DB();
global.LOGGER = new E.Logger();

const server = new E.Server(
	{
		"title": "Yakchat Auth REST Server",
		"version": pjson.version,
		"config": {
			"port": process.env.PORT,
			"routers":[
				{ "relpath": "routers" }
			]
		}
	},
	{

	}
);
const auth = new E.Auth(process.env.JWT_SECRET);

// Unhandled exceptions
process.on('uncaughtException', function (err) {
	LOGGER.error('Unexpected Error:', err, err.stack);
	process.exit(1);
});

// Graceful-shutdown
process.on('SIGINT', () => {
	LOGGER.info('SIGINT signal received.');
	try {
		server.close()
		// Check db connection and close it
		if (global.db) {
			global.db.close();
		}
	} catch (error) {
		LOGGER.error(error);
		process.exit(1);
	}
});


server.start();
