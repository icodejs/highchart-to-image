var path = require('path');

module.exports = {
    phantomServer: {
        host: '127.0.0.1',
        port: 3003,
        scriptPath: path.join(__dirname, '../lib/highcharts/highcharts-convert-timer.js')
    },
    service: {
        port: 4005
    }
};
