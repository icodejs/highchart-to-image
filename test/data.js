module.exports = {
    highchart: {
        config: {
            constr: 'Chart',
            type: 'image/png',
            width: '750',
            scale: 4,
            infile: {
                chart: {
                    type: 'spline',
                    inverted: true
                },
                title: {
                    text: 'Atmosphere Temperature by Altitude'
                },
                subtitle: {
                    text: 'According to the Standard Atmosphere Model'
                },
                xAxis: {
                    reversed: false,
                    title: [Object],
                    labels: {},
                    maxPadding: 0.05,
                    showLastLabel: true
                },
                yAxis: {
                    title: [Object],
                    labels: {},
                    lineWidth: 2
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br/>',
                    pointFormat: '{point.x} km: {point.y}C'
                },
                plotOptions: {
                    spline: [Object]
                },
                series: [
                    [Object]
                ]
            },
            outfile: 'tmp/1385926742028.png'
        }
    }
};
