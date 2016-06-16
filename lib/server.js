'use strict';

const http = require('http');
const pify = require('pify');
const debug = require('debug')('http');

const host = 'localhost';
const port = process.env.PORT || 3010;

function createServer(fn) {
	const server = http.createServer(fn);
	server.host = host;
	server.port = port;
	server.url = `http://${host}:${port}`;
	server.protocol = 'http';
	server.listen(port, () => {
		debug('server running', port);
	});
	server.close = pify(server.close);
	return server;
}

module.exports = createServer;
