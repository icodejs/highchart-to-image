
/* jshint expr:true */

var chai = require('chai');
var sinon_chai = require("sinon-chai");
var expect = chai.expect;
var Config = require('../config/config');
var Data = require('./data');
var http = require('http');
var server = require('./server');

chai.use(sinon_chai);

describe('lib/convert', function() {

    describe('converting a chart to an image', function () {
        this.timeout(4000);

        before(function () {
            server.start();
        });

        after(function () {
            server.stop();
        });

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

        describe('when specifying html as the return type', function () {
            var testRequest = function(path, callback) {
                var formString = JSON.stringify(Data.highcharts.config);
                var options = getOptions(path, formString.length);

                http.request(options, function(res) {
                    var b64ImageString = '';
                    res.on('data', function(chunk) {
                        b64ImageString += chunk;
                    });
                    res.on('end', function() {
                        callback(null, b64ImageString);
                    });
                }).on('error', callback).end(formString);
            };

            it('should return HTML', function(done) {
                testRequest('/convert-html', function (err, b64ImageString) {
                    if (err) throw err;
                    else {
                        expect(b64ImageString.length > 1).to.equal(true);
                        expect(b64ImageString.indexOf('<img') > -1).to.equal(true);
                        expect(b64ImageString).to.contain(Data.highcharts.base64Image);
                    }
                    done();
                });
            });

            it('should return an array of strings', function(done) {
                testRequest('/convert-base64', function (err, b64ImageString) {
                    if (err) throw err;
                    else {
                        var results = JSON.parse(b64ImageString);
                        expect(results.length > 0).to.equal(true);
                        expect(results).to.be.instanceof(Array);
                        expect(results[0].length > 0).to.equal(true);
                        expect(results[0]).to.equal(Data.highcharts.base64Image);
                    }
                    done();
                });
            });
        });

    });

});
