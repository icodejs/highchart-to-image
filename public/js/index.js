$(function () {
    var $config = $('.config').val('{"title":{"text":"Monthly Average Temperature","x":-20},"subtitle":{"text":"Source: WorldClimate.com","x":-20},"xAxis":{"categories":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},"yAxis":{"title":{"text":"Temperature (C)"},"plotLines":[{"value":0,"width":1,"color":"#808080"}]},"tooltip":{"valueSuffix":"C"},"legend":{"layout":"vertical","align":"right","verticalAlign":"middle","borderWidth":0},"series":[{"name":"Tokyo","data":[7,6.9,9.5,14.5,18.2,21.5,25.2,26.5,23.3,18.3,13.9,9.6]},{"name":"New York","data":[-0.2,0.8,5.7,11.3,17,22,24.8,24.1,20.1,14.1,8.6,2.5]},{"name":"Berlin","data":[-0.9,0.6,3.5,8.4,13.5,17,18.6,17.9,14.3,9,3.9,1]},{"name":"London","data":[3.9,4.2,5.7,8.5,11.9,15.2,17,16.6,14.2,10.3,6.6,4.8]}]}');

    var $button = $('button');
    var $result = $('.result');
    var $output = $('.output');
    var $constr = $('.constr');
    var $width = $('.width');
    var $scale = $('.scale');

    $button.on('click', function (e) {
        e.preventDefault();

        var config = $config.val().length ? JSON.parse($config.val()) : {chart: { type: 'spline', inverted: true }, title: { text: 'Atmosphere Temperature by Altitude' }, subtitle: { text: 'According to the Standard Atmosphere Model' }, xAxis: { reversed: false, title: { enabled: true, text: 'Altitude' }, labels: { formatter: function() { return this.value +'km'; } }, maxPadding: 0.05, showLastLabel: true }, yAxis: { title: { text: 'Temperature' }, labels: { formatter: function() { return this.value + '°'; } }, lineWidth: 2 }, legend: { enabled: false }, tooltip: { headerFormat: '<b>{series.name}</b><br/>', pointFormat: '{point.x} km: {point.y}C' }, plotOptions: { spline: { marker: { enable: false } } }, series: [{ name: 'Temperature', data: [[0, 15], [10, -50], [20, -56.5], [30, -46.5], [40, -22.1], [50, -2.5], [60, -27.7], [70, -55.7], [80, -76.5]] }] };

        var data = {
            constr: $constr.val(),
            width: $width.val() || 750,
            scale: $scale.val(),
            infile: config
        };

        $.ajax({
            url: '/convert-html',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify([data, data]),
        }).done(function(result) {
            var output = JSON.stringify(data, null, '\t');
            $result.html(result);
            $output.find('pre').text(output);
            console.log(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $result.html(errorThrown);
        });
    });
});
