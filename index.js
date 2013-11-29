
var http = require('http');
var express = require('express');
var app = express();
var Q = require('q');
var Config = require('./config/config');
var _ = require('lodash');
var alive = false;
var healthCheck = require('./lib/healthCheck');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});


app.post('/convert-html', function(req, res) {
    convert(req, res, 'html');
});


app.post('/convert-base64', function(req, res) {
    convert(req, res, 'base64');
});


app.get('/healthcheck', healthCheck.status);


app.listen(Config.service.port);


var convert = function (req, res, type) {
    var items = req.body;
    var promises = _.chain(items).each(extendProps).map(generateImage).value();

    Q.all(promises).done(function (results) {
        if (/html/i.test(type)) returnAsHtml(res, results);
        else returnAsJSON(res, results);
    }, function (err) {
        res.end(500, err.toString());
    });
};


var extendProps = function (o) {
    var d = new Date();
    _.extend(o, {
        outfile: 'tmp/' + d.getTime() + '.png',
        constr: "Chart",
        type: "image/png",
        scale: 4
    });
};


var returnAsHtml = function (res, results) {
    var images = '';
    var _concat = function(buf){ images += '<img src="data:image/png;base64,' + buf + '" />'; };

    results.forEach(_concat);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(images);
};


var returnAsJSON = function (res, results) {
    var images = [];
    var _concat = function(buf){ images.push(buf); };

    results.forEach(_concat);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(images));
};


var generateImage = function(form) {
    var b64ImageString = '';
    var def = Q.defer();
    var run = function() {
        var formString = JSON.stringify(form);
        var options = {
            port: Config.phantomServer.port,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': formString.length
            }
        };

        var req = http.request(options, function(res) {
            res.on('data', function(chunk){ b64ImageString += chunk; });
            res.on('end', function(){ def.resolve(b64ImageString); });
        });
        req.on('error', function(err){ def.reject(err.toString()); });
        req.write(formString);
        req.end();
    };

    // START SERVER IF NOT ALREADY STARTED
    if (alive) run();
    else startImageServer(run);

    return def.promise;
};


var startImageServer = function(callback) {
    var childProcess = require('child_process');
    var phantomjs = require('phantomjs');
    var binPath = phantomjs.path;
    var childArgs = [
        Config.phantomServer.scriptPath,
        '-host',
        Config.phantomServer.host,
        '-port',
        Config.phantomServer.port
    ];

    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
        alive = false;
    });

    alive = true;

    // hack to run callback after server has started
    setTimeout(function () { if (callback) callback(); }, 3000);
};

