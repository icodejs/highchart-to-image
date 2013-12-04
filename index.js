
var express = require('express');
var app = express();
var Config = require('./config/config');
var healthCheck = require('./lib/healthCheck');
var convert = require('./lib/convert');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.post('/convert-svg', convert.toSVG); // returns array of svg strings
app.post('/convert-html', convert.toHTML); // returns n base64 images as HTML
app.post('/convert-base64', convert.toBase64); // returns array of base64 strings
app.get('/healthcheck', healthCheck.status);

app.listen(Config.service.port);




