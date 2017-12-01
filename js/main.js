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

var chart2 = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart3 = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart4 = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dateDomain = [new Date(1995, 0), new Date(2016, 7)];

//create axes but dont call them untill updateChart()
var xAxis2 = chart2.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, height]+')');
var yAxis2 = chart2.append('g')
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

var currentIndex = 0;

function position() {
  var pos = window.pageYOffset - 10;
  var sectionIndex = d3.bisect(sectionPositions, pos);
  sectionIndex = Math.min(sections.length - 1, sectionIndex);

  if (currentIndex !== sectionIndex) {

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
    //chart2 code
    nested = d3.nest()
       .key(function(d) { return d.Broad_Phase_of_Flight; })
       .rollup(function(v) { return {
         count: v.length,
         fatalities: d3.sum(v, function(d) {return d.Total_Fatal_Injuries; }),
         injured: d3.sum(v, function(d) {return d.Total_Serious_Injuries; }),
         safe: d3.sum(v, function(d) {return d.Total_Uninjured; })
       }; })
     .entries(incidents);

    // var barscale = d3.scale.log().domain([0, function(d) { return d.safe }]);
    // nested = nested.filter( d => (d.safe > 0 || d.injured > 0 || d.fatalities > 0));
    // console.log(nested);
    counter = 0;
    padding = 1;


    // tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
    // var tip2 = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return "<strong>Frequency:</strong> <span style='color:red'>" + d.value.safe + "</span>";
    //   })

    barsgreen = chart2.append("g");
    barsgreen.selectAll("greenbars")
    .data(nested)
    .enter().append("rect")
    .attr("y", function(d) {
        // console.log((d.value.safe + ", " + d.value.injured + ", " + d.value.fatalities));
        return height - (height * (d.value.safe / (d.value.safe + d.value.injured + d.value.fatalities)));
    })
    .attr("x", function(d) {
        counter++;
        return ((counter - 1) * ((width/13) + padding)) + padding;
    })
    .attr("height", function(d) {
        // return 50;
        // console.log(barscale(d.value.injured));
        return height * (d.value.safe / (d.value.safe + d.value.injured + d.value.fatalities));
    })
    .attr("width", (width / 13) - (padding * 2))
    // .on("mouseover", function(d) { console.log("hello") ;})
    // .on("mouseout", function(d) { console.log("hello" );})
    .style("fill", "40bf40");
    counter = 0;



    barsyellow = chart2.append("g")
        .selectAll("yellowbars")
        .data(nested)
        .enter().append("rect")
        .attr("y", function(d) {
            console.log(d.key);
            return height  - (height * (d.value.safe / (d.value.safe + d.value.injured + d.value.fatalities))) - (height * (d.value.injured / (d.value.safe + d.value.injured + d.value.fatalities)));
        })
        .attr("x", function(d) {
            counter++;
            return ((counter - 1) * ((width/13) + padding)) + padding;
        })
        .attr("height", function(d) {
            // return 50;
            // console.log(barscale(d.value.injured));
            return (height * (d.value.injured / (d.value.safe + d.value.injured + d.value.fatalities)));
        })
        .attr("width", (width / 13) - (padding * 2))
        // .on("mouseover", function(d) { console.log("helo"); })
        // .on("mouseout", function(d) { console.log("helo"); })
        .style("fill", "#f7cb09");
    counter = 0;

    barsred = chart2.append("g")
    .selectAll("redbars")
    .data(nested)
    .enter().append("rect")
    .attr("y", function(d) {
        // console.log(d.value.fatalities);
        return 0;
        // return height + 60 - (height * (d.value.safe / (d.value.safe + d.value.injured + d.value.fatalities))) - (d.value.injured / (d.value.safe + d.value.injured + d.value.fatalities)) - (height * (d.value.fatalities / (d.value.safe + d.value.injured + d.value.fatalities)));
    })
    .attr("x", function(d) {
        counter++;
        return ((counter - 1) * ((width/13) + padding)) + padding;
    })
    .attr("height", function(d) {
        // return 50;
        // console.log(barscale(d.value.injured));
        return height * (d.value.fatalities / (d.value.safe + d.value.injured + d.value.fatalities));
    })
    .attr("width", (width / 13) - (padding * 2))
    // .on("mouseover", function(d) { console.log("helo"); })
    // .on("mouseout", function(d) { console.log("helo"); })
    .style("fill", "a82525");

    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(22,505), rotate(-45)')
    .text('CRUISE');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(79,516), rotate(-45)')
    .text('LANDING');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(142,522), rotate(-45)')
    .text('STANDING');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(205,526), rotate(-45)')
    .text('APPROACH');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(285,513), rotate(-45)')
    .text('TAKEOFF');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(365,499), rotate(-45)')
    .text('CLIMB');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(440,491), rotate(-45)')
    .text('TAXI');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(488,503), rotate(-45)')
    .text('OTHER');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(538,526), rotate(-45)')
    .text('UNREPORTED');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(590,547), rotate(-45)')
    .text('MANEUVERING');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(672,526), rotate(-45)')
    .text('UNKNOWN');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(757,515), rotate(-45)')
    .text('DESCENT');
    barsgreen.append('text')
    .attr('class', 'bar label')
    .attr('transform', 'translate(804,535), rotate(-45)')
    .text('GO-AROUND');


    //chart3 code
    var xDomain3 = [0, 6000];
    var xScale3 = d3.scaleLinear()
        .domain(xDomain3)
        .range([0,width]);
    var xAxis3 = d3.axisBottom(xScale3);

    chart3.append('g')
    	.attr('class', 'x axis')
        .attr('transform', 'translate('+[0, height]+')')
    	.call(xAxis3);

    nestedMake = d3.nest()
        .key(function(d) { return d['Make']; })
        .rollup(function(leaves){
            var deathTotal = d3.sum(leaves, function(d){
                return d['Total_Fatal_Injuries'];
            })
            return deathTotal;
        })
        .entries(datum);
        console.log(nestedMake);

    nestedModel = d3.nest()
        .key(function(d) { return d['Model']; })
        .rollup(function(leaves){
            var deathTotal = d3.sum(leaves, function(d){
                return d['Total_Fatal_Injuries'];
            })
            return deathTotal;
        })
        .entries(datum);
        console.log(nestedModel);

        var bars3 = chart3.append("g");

        bars3.selectAll('.bar')
            .data(nestedMake)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', function(d, i) {
                return i *  (height / 5);
            })
            .attr('x','0')
            .attr('height', height / 5 - 30)
            .attr('width', function(d) {
                return xScale3(d.value);
            });

            bars3.append('text')
        	   .attr('class', 'bar label')
               .attr('transform', 'translate(180,40)')
        	   .text('Bombardier');
            bars3.append('text')
           	   .attr('class', 'bar label')
               .attr('transform', 'translate(180,130)')
               .attr('fill', '#fff')
           	   .text('Boeing');
            bars3.append('text')
          	   .attr('class', 'bar label')
               .attr('transform', 'translate(180,225)')
          	   .text('McDonnell Douglas');
           bars3.append('text')
         	   .attr('class', 'bar label')
              .attr('transform', 'translate(180,320)')
         	   .text('Embraer');
           bars3.append('text')
         	   .attr('class', 'bar label')
              .attr('transform', 'translate(180,405)')
              .attr('fill', '#fff')
         	   .text('Airbus');


               /// chart4 code

        var parser = d3.timeParse("%m/%d/%Y");
        datum.forEach(function(d) {
            d.Event_Date = parser(d.Event_Date);
        });

        var xScale4 = d3.scaleTime()
            .domain(dateDomain) // Scale time requires domain is Date objects
            .range([0, width]); // Range is width of trellis chart space
        chart4.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,'+height+')') // Only translate within trellis pixel space
            .call(d3.axisBottom(xScale4));


    //make the initial call to update with the first index paramter
    updateChart(0);
  });

  function updateChart(index) {
      //call update with the index of the scrollyteller, update the chart differently using cases to create unique charts here
      switch(index) {
          case 0:
            console.log('code for vis 1 here');
            chart2.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);
            chart3.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);
            chart4.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);
          break;

          case 1:

            console.log('code for vis 2 here');

            chart3.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);
            chart4.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);

            // xAxis2.transition()
            //     .duration(750) // Add transition
            //     .call(d3.axisBottom(xScale));
            // yAxis2.transition()
            //     .duration(750) // Add transition
            //     .call(d3.axisLeft(yScale));


            chart2.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 1);



          break;

          case 2:
            console.log('code for vis 3 here');

            chart2.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);

            chart4.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);

            chart3.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 1);
          break;
          case 3:
            console.log('code for vis 4 here');

            chart2.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);

            chart3.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 0);

            chart4.selectAll("g")
                .transition()
                .duration(750)
                .attr("opacity", 1);
          break;
      }
      //call axes

  }
