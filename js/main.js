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
// svg.append("rect")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("fill", "white");

var chart1 = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
sectionPositions = [500,1400,2100,2800];

// var startPos;
// for (var i = 0, len = sections.length; i < len; i++) {
//     var current = sections[i];
//     if(i === 0) {
//       startPos = current.getBoundingClientRect().top;;
//     }
//     sectionPositions.push(current.getBoundingClientRect().top - startPos);
// }

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


//chart1/map code
var atlLatLng = new L.LatLng(10, 15);
var myMap = L.map('map').setView(atlLatLng, 2);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
    minZoom: 1,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA'
}).addTo(myMap);

var svgLayer = L.svg();
svgLayer.addTo(myMap)

var svg2 = d3.select('#map').select('svg');
var nodeLinkG = svg2.select('g')
    .attr('class', 'leaflet-zoom-hide');

d3.queue()
    .defer(d3.csv, './data/aircraft_incidents.csv', function(row) {
        return {id: row['Accident_Number'], location: row['Location'], LatLng: [+row['Latitude'], +row['Longitude']], severity: row['Injury_Severity'],
            damage: row['Aircraft_Damage'], make: row['Make']};
    })    .await(readyToDraw);

function readyToDraw(error, nodes) {
    if(error) {
        console.error('Error while loading datasets.');
        console.error(error);
        return;
    }

    chart1.selectAll('.grid-node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'grid-node')
        .style('fill', function(d) {
            if (d.severity == "Unavailable"){
                return "#99AEAC";
            } else if (d.severity == "Incident") {
                return "#FAC503";
            } else if (d.severity == "Non-Fatal") {
                return "#D46D00";
            } else {
                return "#900000";
            }

        })
        .style('fill-opacity', function(d) {
            if (d.LatLng == [0,0]) {
                return 0
            }
            return 0.5;
        })
        .attr('cx', function(d){
            return myMap.latLngToLayerPoint(d.LatLng).x})
        .attr('cy', function(d){return myMap.latLngToLayerPoint(d.LatLng).y})
        .attr('r', 3);
            console.log(nodes);
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

    var bg2 = chart2.append("g");
    bg2.append("rect")
        .attr('transform', 'translate('+[-70, -70]+')')
        .attr("width", 1000)
        .attr("height", 600)
        .attr("fill", "white");

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
    .attr('class', 'g2label')
    .attr('transform', 'translate(22,500), rotate(-45)')
    .attr('font-size', '12px')
    .text('CRUISE');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(81,509), rotate(-45)')
    .attr('font-size', '12px')
    .text('LANDING');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(145,512), rotate(-45)')
    .attr('font-size', '12px')
    .text('STANDING');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(210,515), rotate(-45)')
    .attr('font-size', '12px')
    .text('APPROACH');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(285,511), rotate(-45)')
    .attr('font-size', '12px')
    .text('TAKEOFF');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(363,501), rotate(-45)')
    .attr('font-size', '12px')
    .text('CLIMB');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(435,496), rotate(-45)')
    .attr('font-size', '12px')
    .text('TAXI');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(488,503), rotate(-45)')
    .attr('font-size', '12px')
    .text('OTHER');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(538,526), rotate(-45)')
    .attr('font-size', '12px')
    .text('UNREPORTED');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(597,530), rotate(-45)')
    .attr('font-size', '12px')
    .text('MANEUVERING');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(679,515), rotate(-45)')
    .attr('font-size', '12px')
    .text('UNKNOWN');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(757,510), rotate(-45)')
    .attr('font-size', '12px')
    .text('DESCENT');
    barsgreen.append('text')
    .attr('class', 'g2label')
    .attr('transform', 'translate(804,520), rotate(-45)')
    .attr('font-size', '12px')
    .text('GO-AROUND');


    //chart3 code
    var xDomain3 = [0, 6000];
    var xScale3 = d3.scaleLinear()
        .domain(xDomain3)
        .range([0,width]);
    var xAxis3 = d3.axisBottom(xScale3);


    var bg3 = chart3.append("g");
    bg3.append("rect")
        .attr('transform', 'translate('+[-70, -70]+')')
        .attr("width", 1000)
        .attr("height", 600)
        .attr("fill", "white");

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
            .attr('fill', '#76A9CF')
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
           bars3.append('text')
         	   .attr('class', 'axis label')
              .attr('transform', 'translate(400,500)')
         	   .text('Fatalities');


               /// chart4 code
               var bg4 = chart4.append("g");
               bg4.append("rect")
                   .attr('transform', 'translate('+[-70, -70]+')')
                   .attr("width", 1000)
                   .attr("height", 600)
                   .attr("fill", "white");

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
