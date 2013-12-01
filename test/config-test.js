
/* jshint expr:true */

var chai = require('chai');
var sinon_chai = require("sinon-chai");
var expect = chai.expect;
var Config = require('../config/config');

chai.use(sinon_chai);

describe('config/config', function () {
    it('should contain the relevant keys', function () {
        expect(Config).to.not.be.undefined;
        expect(Config.phantomServer).to.contain.keys('host', 'port', 'scriptPath');
        expect(Config.service).to.contain.keys('port');

    });
});
