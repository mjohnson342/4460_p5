// **** Your JavaScript code goes here ****

///http://vallandingham.me/scroller.html

var svg = d3.select("svg"),
    margin = {top: 70, right: 70, bottom: 70, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x2 = d3.scaleBand().rangeRound([(width/2) + 40, width]).padding(0.1),
    x = d3.scaleBand().rangeRound([0, width/2 - 40]).padding(0.1)
    y = d3.scaleLinear().rangeRound([0,height]);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var sections = document.getElementsByClassName("step");
sectionPositions = [];
var startPos;

for (var i = 0, len = sections.length; i < len; i++) {
    var top = sections[i].getBoundingClientRect().top;
    console.log(sections[i].getBoundingClientRect().top);
    console.log(top); //should be same as above, but isnt????
    if(i === 0) {
      startPos = top;
    }
    sectionPositions.push(top - startPos);
}



d3.select(window)
  .on("scroll.scroller", position);

function position() {
  var pos = window.pageYOffset - 10;
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sections.size() - 1, sectionIndex);

  if (currentIndex !== sectionIndex) {
    dispatch.active(sectionIndex);
    currentIndex = sectionIndex;
  }
}

//aircraft data
d3.csv('./data/aircraft_incidents.csv', function(error, datum){
    if(error) {
        console.error('error loading coffee_data.csv');
        console.error(error);
        return;
    }

  });
