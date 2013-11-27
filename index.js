
var http = require('http');
var express = require('express');
var app = express();
var Q = require('q');
var Config = require('./config/config');
var alive = false;

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});


app.post('/convert', function(req, res) {
    var items = req.body;
    var appendTempPath = function (o) {
        var d = new Date();
        o.outfile = 'tmp/' + d.getTime() + '.png';
    };
    var promises;

    items.forEach(appendTempPath);

    promises = items.map(generateImage);

    Q.all(promises).done(function (results) {
        var images = '';
        var concatImageString = function(buf){ images += buf; };

        results.forEach(concatImageString);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(images);
    }, function (err) {
        res.end(500, err);
    });
});

app.listen(Config.service.port);


var generateImage = function(form) {
    var img = '';
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
            res.on('data', function(chunk) { img += chunk; });
            res.on('end', function() {
                def.resolve('<img src="data:image/png;base64,' + img  + '" />');
            });
        });
        req.on('error', function (err) {
            def.reject(err.toString());
        });
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

