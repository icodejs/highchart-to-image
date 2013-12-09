
var http = require('http');
var Q = require('q');
var _ = require('lodash');
var alive = false;
var Config = require('../config/config');


/* private */

var convert = function (req, res, type) {
    var items = req.body;
    var _extend = extend(type); // partial application
    var promises = _.chain(items).each(_extend).map(generateImage).value();

    Q.all(promises).done(function (results) {
        if (/image/i.test(type)) {
            var str = results[0];
            var buf = new Buffer(str, 'base64');
            res.end(buf);
        }
        else {
            var arr = returnArray(res, results, type);
            res.json(arr);
        }
    }, function (err) {
        res.send(500, { error: err });
        res.end();
    });
};


var returnArray = function (res, results, type) {
    var tmp = '<img src="data:image/png;base64,{img}" />';
    var fn;

    if (/html/i.test(type)) {
        fn = function(str){ return tmp.replace('{img}', str); };
    }
    else {
        fn = function(str){ return str; };
    }
    return results.map(fn);
};


var extend = function (type) {
    return function (o) {
        var d = new Date();
        _.extend(o, {
            outfile: 'tmp/' + d.getTime() + '.png',
            constr: "Chart",
            type: "image/png",
            returnAs: type.toLowerCase(),
            scale: 4
        });
    };
};


var generateImage = function(form) {
    // uses phantomjs server to generate image
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

    childProcess
        .execFile(binPath, childArgs, function(err, stdout, stderr) {
            console.log(err);
            console.log(stdout);
            console.log(stderr);
            alive = false;
        })
        .stdout.on('data', function (data) {
            // use stdout to send messages from child process
            try {
                var d = JSON.parse(data);
                var loaded = (/loaded/i).test(d.status);
                if (loaded) {
                    alive = true;
                    callback();
                }
            } catch (e) {
                console.log(data);
                console.log(e);
            }
        });
};


/* public */

module.exports.toHTML = function (req, res) {
    convert(req, res, 'html');
};

module.exports.toBase64 = function (req, res) {
    convert(req, res, 'base64');
};

module.exports.toSVG = function (req, res) {
    convert(req, res, 'svg');
};

module.exports.toImage = function (req, res) {
    convert(req, res, 'image');
};
