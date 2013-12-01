
var convert = require('../lib/convert');
var Config = require('../config/config');

module.exports = (function () {
    var express = require('express');
    var app = express();
    var server;

    return {
        start: function () {
            app.use(express.bodyParser());
            app.post('/convert-html', convert.toHTML);
            app.post('/convert-base64', convert.toBase64);

            server = app.listen(Config.service.port);
        },
        stop: function () {
            server.close();
        }
    };
}());
