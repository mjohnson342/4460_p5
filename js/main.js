
// **** Your JavaScript code goes here ****

    var svg = d3.select("svg"),
        margin = {top: 70, right: 70, bottom: 70, left: 70},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x2 = d3.scaleBand().rangeRound([(width/2) + 40, width]).padding(0.1),
        x = d3.scaleBand().rangeRound([0, width/2 - 40]).padding(0.1)
        y = d3.scaleLinear().rangeRound([0,height]);

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //aircraft data
    d3.csv('./data/aircraft_incidents.csv', function(error, datum){
        if(error) {
            console.error('error loading coffee_data.csv');
            console.error(error);
            return;
        }

      });
