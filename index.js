'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const got = require('got');
const pify = require('pify');
const cheerio = require('cheerio');
const queryString = require('query-string');
const debug = require('debug')('http');

const host = 'localhost';
const port = 3010;

function createServer(fn) {
	const server = http.createServer(fn);
	server.host = host;
	server.port = port;
	server.url = `http://${host}:${port}`;
	server.protocol = 'http';
	server.listen(port);
	server.close = pify(server.close);
	debug('server running', port);
	return server;
}

function xFrame(req, res) {
	const qs = queryString.parse(url.parse(req.url).query);
	debug(qs);
	if (qs.url) {
		qs.protocolo = qs.protocolo || 'http';
		got(qs.url)
			.then(response => {
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				const $ = cheerio.load(response.body);
				$('head').prepend(`<base href="${qs.protocolo}://${qs.url}">`);
				res.end($.html());
			})
			.catch(error => {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end(error.response.body);
			});
	} else {
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end('Bad Request - missing url');
	}
}

createServer((req, res) => {
	const p = url.parse(req.url);
	if (p.pathname === '/') {
		xFrame(req, res);
	} else if (p.pathname === '/favicon.ico') {
		fs.readFile(path.join(__dirname, 'public', 'favicon.ico'), (err, data) => {
			if (err) {
				throw err;
			}
			res.write(data, 'binary');
			res.end();
		});
	} else {
		res.end('apenas um show');
	}
});
