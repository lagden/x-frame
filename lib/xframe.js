'use strict';

const url = require('url');
const got = require('got');
const cheerio = require('cheerio');
const queryString = require('query-string');
const debug = require('debug')('http');

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
		res.end('Bad Request');
	}
}

module.exports = xFrame;
