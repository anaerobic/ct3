'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _libUtil = require('./lib/util');

var options = {
  // key: fs.readFileSync('config/cert.key'),
  // cert: fs.readFileSync('config/cert.crt')
};

var app = (0, _express2['default'])();
app.use((0, _cookieParser2['default'])());

var servers = _config2['default'].get('servers');

console.log("SERVERS: ", servers);
var serverMap = {};
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = servers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var s = _step.value;

    console.log("SERVER: ", s);
    serverMap[s.name] = s.host;
  }
  //
  // Create a proxy server with custom application logic
  //
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator['return']) {
      _iterator['return']();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var proxy = _httpProxy2['default'].createProxyServer({});

proxy.on('error', function (error, req, res) {
  console.log('proxy error', error);
  res.end("DUDE");
});

app.all('/*', function (req, res, next) {
  if (req.headers['X-Forwarded-Proto'] == 'http') {
    console.log('FORWARDING TO HTTPS: ' + req.hostname + ', ' + req.url);
    return res.redirect(301, ['https://', req.hostname, req.url].join(''));
    return;
  }

  if (!req.cookies.LB_STICKY) {
    var server = servers[(0, _libUtil.randomInt)(0, servers.length)];
    res.cookie('LB_STICKY', server.name);
    console.log("REDIRECTING TO: " + req.path);
    res.redirect(301, req.path);
  } else {
    console.log('COOKIE: ' + req.cookies.LB_STICKY + ' - ' + req.path);
    var target = serverMap[req.cookies.LB_STICKY];
    if (target) {
      req.headers['X-For-App'] = req.cookies.LB_STICKY;
      proxy.web(req, res, {
        target: target,
        secure: false,
        xfwd: true,
        changeOrigin: true,
        autoRewrite: true
      });
    } else {
      res.clearCookie('LB_STICKY');
      console.log("CONFIG CHANGED.  REDIRECTING TO: " + req.path);
      res.redirect(301, req.path);
    }
  }
});

console.log("listening...");
_http2['default'].createServer(app).listen(_config2['default'].get('http-port'));
_https2['default'].createServer(options, app).listen(_config2['default'].get('https-port'));