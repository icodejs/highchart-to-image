
var Q = require('q');
var http = require('http');
var Config = require('../config/config');
var Data = require('../test/data');

var getOptions = function(path, len) {
    return {
        port: Config.service.port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': len
        }
    };
};


var canRespond = function (path) {
    var def = Q.defer();
    var formString = JSON.stringify(Data.highcharts.config);
    var options = getOptions(path, formString.length);

    http.request(options, function(res) {
        var b64ImageString = '';
        res.on('data', function(chunk) {
            b64ImageString += chunk;
        });
        res.on('end', function() {
            def.resolve(b64ImageString);
        });
    }).on('error', def.reject).end(formString);
    return def.promise;
};


module.exports.status = function (req, res) {
    var promises = [
        canRespond('/convert-html'),
        canRespond('/convert-base64'),
        canRespond('/convert-svg')
    ];
    Q.all(promises).done(function () {
        res.end('OK');
    }, function () {
        res.send(500, { error: 'Error' });
        res.end();
    });
};
