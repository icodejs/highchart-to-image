
/* jshint expr:true */

var chai = require('chai');
var sinon_chai = require("sinon-chai");
var expect = chai.expect;
var Data = require('./data');
var request = require('request');

chai.use(sinon_chai);

// TBC
describe('lib/convert', function () {
    describe('converting a chart to an image', function () {
        describe('when specifying html as the return type', function () {
            it('should return HTML', function () {
                expect(true).to.equal(true);
            });
        });

        describe('when specifying base64 as the return type', function () {
            it('should return an array of base64 strings', function () {
                expect(true).to.equal(true);
            });
        });
    });
});
