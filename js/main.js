// **** Your JavaScript code goes here ****

///http://vallandingham.me/scroller.html

var svg = d3.select("svg"),
    margin = {top: 70, right: 70, bottom: 70, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;


// var x2 = d3.scaleBand().rangeRound([(width/2) + 40, width]).padding(0.1),
//     x = d3.scaleBand().rangeRound([0, width/2 - 40]).padding(0.1)
//     y = d3.scaleLinear().rangeRound([0,height]);

var chartG = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
console.log(sections);

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
    currentIndex = sectionIndex;
    // console.log(currentIndex);
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

  //call update with the index of the scrollyteller, update the chart differently using cases to create unique charts here
  function updateChart(index) {
      //update yScale.domain here to change axes widh on transition, see https://github.gatech.edu/CS-4460/Labs/blob/master/07_lab/solution/main.js
      switch(index) {
          case 0:
            console.log('code for vis 1 here');
            xAxisG.transition()
            .duration(750)
            .call(d3.axisBottom(xScale));

            yAxisG.transition()
              .duration(750)
              .call(d3.axisLeft(yScale));
          break;
          case 1:
            console.log('code for vis 2 here');
          break;
          case 2:
            console.log('code for vis 3 here');
          break;
      }
      //call axes

  }
