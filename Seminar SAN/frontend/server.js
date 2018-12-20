process.on('unhandledRejection', err => console.error("unhandled rejection:", err));

var host; // =  "127.0.0.1";
var port = 8000;
var protocol = "http";

var express = require("express");
var http = require('http')
var https = require('https')
var fs = require("fs");

// create the web server
var app = express();

// add support for parsing POST data
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

// handlers
app.get('/xxx', async function (req, res, next) {
  // ... res.send({amount: cache.min_bet});
})

app.post('/xxx', async function (req, res, next) {
  // ... req.body[x];
})

// static routes
var rootDir = __dirname + "/www";
app.use('/eat', express.static(rootDir));
app.use('/cook', express.static(rootDir));
app.use('/meal/:id', express.static(rootDir));
app.use('/meal/:id/edit', express.static(rootDir));
app.use('/', express.static(rootDir));

// print the error stack on error
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('some server error');
})

// start listening
if (protocol == "http") {
  app.listen(port, host);
} else {
  var https = require('https');
  var credentials = {
    key: fs.readFileSync('cert/server.key', 'utf8'), 
    cert: fs.readFileSync('cert/server.crt', 'utf8')
  };
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port);
}
console.log('running server at ' + protocol + '://' + host + ':' + port);
console.log('serving files from ' + rootDir);
