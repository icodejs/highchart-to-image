Highchart to image
==================

##Setup

###Install PhantomJS
[PhantomJS](http://phantomjs.org/)

    $ brew update && brew install phantomjs

###Clone repo

    $ git clone git@github.com:zeebox/highchart-to-image.git


###Install package dependencies

cd into root:

    $ npm install


###Start server

    $ node index.js

##Usage

###Endpoints

    /convert-html  // Returns JSON array of image tags: <img src="data:image/png;base64,<<base64 image string>>" />

    /convert-base64  // Returns JSON Array of base64 encoded images

    /convert-svg  // Returns JSON Array of SVG strings

    /heathcheck // Return 200 OK if all endpoints are doing their job correctly

###Curl

    $ curl -H "Content-Type: application/json" -i -X POST -d '<<payload>>'  http://localhost:4005/convert-html

###jQuery AJAX
```javascript

  $.ajax({
      url: '/convert-html',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify([data, data]), // send (n) configs for each chart
  }).done(function(results) {
      var output = JSON.stringify(data, null, '\t');
      $result.empty();

      for (var i = 0; i < results.length; i++) {
          $result.append(results[0]);
      }
      $output.find('pre').text(output);
      console.log(results);
  }).fail(function(jqXHR, textStatus, errorThrown) {
      $result.html(errorThrown);
  });

```
###Web form

Open: http://localhost:4005/index.html

###Payload Example

    [{
      constr: "Chart", // optional
      width: 750, // optional
      scale: 4, // optional
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
          title: {
            enabled: true,
            text: 'Altitude'
          },
          labels: {
            formatter: function () {
              return this.value + 'km';
            }
          },
          maxPadding: 0.05,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: 'Temperature'
          },
          labels: {
            formatter: function () {
              return this.value + '°';
            }
          },
          lineWidth: 2
        },
        legend: {
          enabled: false
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x} km: {point.y} C'
        },
        plotOptions: {
          spline: {
            marker: {
              enable: false
            }
          }
        },
        series: [{
          name: 'Temperature',
          data: [
            [0, 15],
            [10, -50],
            [20, -56.5],
            [30, -46.5],
            [40, -22.1],
            [50, -2.5],
            [60, -27.7],
            [70, -55.7],
            [80, -76.5]
          ]
        }]
      }
    }];

[Above payload example](http://www.highcharts.com/demo/spline-inverted)
