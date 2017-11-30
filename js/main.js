// **** Your JavaScript code goes here ****

///http://vallandingham.me/scroller.html

var svg = d3.select("svg"),
    margin = {top: 70, right: 70, bottom: 70, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;


// var x2 = d3.scaleBand().rangeRound([(width/2) + 40, width]).padding(0.1),
//     x = d3.scaleBand().rangeRound([0, width/2 - 40]).padding(0.1)
//     y = d3.scaleLinear().rangeRound([0,height]);

//white background
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");

var chartG = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var dispatch = d3.dispatch('active', 'progress');

//create axes but dont call them untill updateChart()
var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, height]+')');

var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

var sections = document.getElementsByClassName("step");
sectionPositions = [];
var startPos;

for (var i = 0, len = sections.length; i < len; i++) {
    var current = sections[i];
    if(i === 0) {
      startPos = current.getBoundingClientRect().top;;
    }
    sectionPositions.push(current.getBoundingClientRect().top - startPos);
}

console.log(sectionPositions);

d3.select(window)
  .on("scroll.scroller", position);

var dispatch = d3.dispatch("active", "progress");
var currentIndex = 0;

function position() {
  var pos = window.pageYOffset - 10;
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sections.length - 1, sectionIndex);

  if (currentIndex !== sectionIndex) {
    //dispatch.active(sectionIndex);
    dispatch.call('active', this, sectionIndex);
    currentIndex = sectionIndex;
    //update chart on transition
    updateChart(currentIndex);
  }
}

//aircraft data
d3.csv('./data/aircraft_incidents.csv', function(error, datum){
    if(error) {
        console.error('error loading coffee_data.csv');
        console.error(error);
        return;
    }
    //create global variable
    incidents = datum;

    //create x and y scale
    xScale = d3.scaleLinear()
        .range([0, width]);
    yScale = d3.scaleLinear()
        .range([height, 0]);



    //make the initial call to update with the first index paramter
    updateChart(0);
  });

  function updateChart(index) {
      //call update with the index of the scrollyteller, update the chart differently using cases to create unique charts here
      switch(index) {
          case 0:
            console.log('code for vis 1 here');
            chartG.selectAll("g")
            .transition()
            .duration(750)
                .attr("opacity", 0);
          break;

          case 1:


            console.log('code for vis 2 here');
            xAxisG.transition()
                .duration(750) // Add transition
                .call(d3.axisBottom(xScale));
            yAxisG.transition()
                .duration(750) // Add transition
                .call(d3.axisLeft(yScale));

                chartG.selectAll("g")
                    .transition()
                    .duration(750)
                    .attr("opacity", 1);

            nested = d3.nest()
                .key(function(d) { return d.Country; })
                .rollup(function(v) { return {
                  count: v.length,
                }; })
              .entries(incidents);
            console.log(nested);
          break;

          case 2:
            console.log('code for vis 3 here');
            chartG.selectAll("g")
            .transition()
            .duration(750)
                .attr("opacity", 0);
          break;
      }
      //call axes

  }
