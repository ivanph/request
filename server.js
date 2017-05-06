const http = require('http');
const parse = require('url').parse;
const request = require('./index');

const server = http.createServer((req, res) => {
  let p = parse(req.url).pathname;
  if (p == '/redirect') {
    res.statusCode = 301;
    res.setHeader('Location', '//127.0.0.1:5000/inspect');
    res.end();
    return;
  }
  if (p === '/inspect') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    let body = '';
    req.on('data', function (c) { body += c });
    req.on('end', function () {
      res.end(JSON.stringify({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body
      }));
    });
    return;
  }
  res.statusCode = 500;
  res.end(JSON.stringify({path: p}))
});

server.listen(5000, 'localhost', srv => {
  var options = {
  url: 'http://localhost:5000/redirect',
  headers: {
    'authorization': 'request'
  }
};
  request(options, (err, res, body) => console.log(body));
})