'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');
const createServer = require('./lib/server');
const xFrame = require('./lib/xframe');

createServer((req, res) => {
	const p = url.parse(req.url);
	if (p.pathname === '/') {
		xFrame(req, res);
	} else if (p.pathname === '/favicon.ico') {
		fs.readFile(path.join(__dirname, 'public', 'favicon.ico'), (err, data) => {
			if (err) {
				throw err;
			}
			res.writeHead(200, {'Content-Type': 'image/x-icon'});
			res.write(data, 'binary');
			res.end();
		});
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.write('404 Not Found');
		res.end('apenas um show');
	}
});
