/* routes/index.js */

function registerRouters(app) {

	app.use('/api/v1/auth', require('./auth')());

};

module.exports = registerRouters;
