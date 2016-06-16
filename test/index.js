// const http = require('http');
import test from 'ava';
import createServer from '../lib/server';
import xFrame from '../lib/xframe';

let s;
test.before(() => {
	s = createServer(xFrame);
});

test.after(() => {
	s.close();
});

test('server', t => {
	t.is(s.url, 'http://localhost:3010');
	// http.request({

	// })
	// const s = createServer((req, res) => {
	// 	res.writeHead(200, {'content-type': 'text/html'});
	// 	res.end();
	// });
});
