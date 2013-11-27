$(function () {
    var $config = $('.config').val('{"chart":{"type":"spline","inverted":true},"title":{"text":"Atmosphere Temperature by Altitude"},"subtitle":{"text":"According to the Standard Atmosphere Model"},"xAxis":{"reversed":false,"title":{"enabled":true,"text":"Altitude"},"labels":{},"maxPadding":0.05,"showLastLabel":true},"yAxis":{"title":{"text":"Temperature"},"labels":{},"lineWidth":2},"legend":{"enabled":false},"tooltip":{"headerFormat":"<b>{series.name}</b><br/>","pointFormat":"{point.x} km: {point.y} C"},"plotOptions":{"spline":{"marker":{"enable":false}}},"series":[{"name":"Temperature","data":[[0,15],[10,-50],[20,-56.5],[30,-46.5],[40,-22.1],[50,-2.5],[60,-27.7],[70,-55.7],[80,-76.5]]}]}');

    var $button = $('button');
    var $result = $('.result');
    var $output = $('.output');
    var $constr = $('.constr');
    var $type = $('.type');
    var $width = $('.width');
    var $scale = $('.scale');

    $button.on('click', function (e) {
        e.preventDefault();
        var config = $config.val();
        var data = [{
            constr: $constr.val(),
            type: $type.val(),
            width: $width.val(),
            scale: $scale.val(),
            infile: config
        }];

        $.ajax({
            url: '/convert',
            type: 'POST',
            dataType: 'html',
            contentType: 'application/json',
            data: JSON.stringify(data),
        }).done(function(html) {
            var output = JSON.stringify(data, null, '\t');
            $result.html(html);
            $output.find('pre').text(output);
        }).fail(function() {
            $result.html('error');
        });
    });
});
