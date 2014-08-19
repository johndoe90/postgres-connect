'use strict';

var pg = require('pg'),
		util = require('util'),
		Bromise = require('bluebird'),
		initializer = require('application-initializer');

var connectionDetails = {
	/*ready: {},
	client: {}*/
};

function buildPostgresUrl(options) {
	return util.format(
		'postgres://%s:%s@%s:%d/%s', 
		options.username, options.password,
		options.host, options.port, options.database
	);
}

function closeConnection() {
	connectionDetails.client.end();
}

function setupConnection(options) {
	if ( !connectionDetails.ready ) {
		connectionDetails.client = Bromise.promisifyAll(new pg.Client(buildPostgresUrl(options)));
		connectionDetails.ready = connectionDetails.client.connectAsync().then(function() {
			process.once('SIGINT', closeConnection);
		});

		initializer.addDependency('Postgres connection', connectionDetails.ready);
	}

	return connectionDetails;
}

module.exports = setupConnection;


