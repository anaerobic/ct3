import http from 'http'
import https from 'https'
import httpProxy from 'http-proxy'
import config from 'config'
import express from 'express'
import fs from 'fs'
import cookieParser from 'cookie-parser'
import {randomInt} from '../lib/util'

var options = {
  // key: fs.readFileSync('config/cert.key'),
  // cert: fs.readFileSync('config/cert.crt')
};

var app = express();
app.use(cookieParser())

var servers = config.get('servers');

console.log("SERVERS: ", servers)
var serverMap = {}
for (let s of servers) {
    console.log("SERVER: ", s)
    serverMap[s.name] = s.host
}
//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({})

proxy.on('error', function (error, req, res) {
    console.log('proxy error', error);
    res.end("DUDE");
});

app.all('/*', function(req, res, next) {
  
  if (req.headers['X-Forwarded-Proto'] == 'http') {
    console.log(`FORWARDING TO HTTPS: ${req.hostname}, ${req.url}`)
    res.redirect(301, [
      'https://',
      req.hostname,
      req.url
    ].join(''));
  }
  else if (!req.cookies.LB_STICKY) {
    let server = servers[randomInt(0, servers.length)]
    res.cookie('LB_STICKY', server.name)

    var url = server.host + req.url;

    console.log("REDIRECTING TO: " + url);
    res.redirect(301, url);
  }
  else {
    console.log(`COOKIE: ${req.cookies.LB_STICKY} - ${req.path}`)
    var target = serverMap[req.cookies.LB_STICKY]
    if (target) {
      req.headers['X-For-App'] = req.cookies.LB_STICKY;
      proxy.web(req, res, {
        target: target,
        secure: false,
        xfwd: true,
        changeOrigin: true,
        autoRewrite: true
      })
    }
    else {
      res.clearCookie('LB_STICKY')
      console.log("CONFIG CHANGED.  REDIRECTING TO: " + req.path)
      res.redirect(301, req.path)
    }
  }
})

console.log("listening at http://localhost:" + config.get('http-port'))
http.createServer(app).listen(config.get('http-port'))

console.log("listening at https://localhost:" + config.get('https-port'))
https.createServer(options, app).listen(config.get('https-port'))
