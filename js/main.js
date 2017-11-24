
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

    d3.csv('./data/coffee_data.csv', function(error, datum){
        if(error) {
            console.error('error loading coffee_data.csv');
            console.error(error);
            return;
        }
        //grouped by region
        var byRegion = d3.nest()
        .key(function(d) { return d.region; })
        .rollup(function(v) { return  d3.sum(v, function(d) { return d.sales; }) ;})
        .entries(datum);
        regmax = 272264;

        y.domain([300000, 0]);
        x.domain(["Central", "East", "South", "West"]);
        x2.domain(["Coffee", "Tea", "Espresso", "Herbal Tea"]);

        g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

        g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x2));

        g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + (width/2 + 40) + ",0)")
    .call(d3.axisLeft(y).ticks(5))
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");

        g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(5))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");

    var byCategory = d3.nest()
    .key(function(d) { return d.category; })
    .rollup(function(v) { return  d3.sum(v, function(d) { return d.sales; }) ;})
    .entries(datum);

    g.selectAll(".bar")
    .data(byRegion)
    .enter().append("rect")
      .attr("transform", "translate(10,0)")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", 40)
      .attr("height", function(d) { return height - y(d.value); });

    console.log(byCategory);

    var g2 = g.append("g")
    .selectAll(".bar")
      .data(byCategory)
      .enter().append("rect")
      .attr("transform", "translate(10,0)")
      .attr("class", "bar")
      .attr("x", function(d){ return x2(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", 40)
      .attr("height", function(d) { return height - y(d.value); });

    g.append("text")
      .attr("transform", "translate(-53,300)rotate(-90)")
      .text("Coffee Sales (USD)");
    g.append("text")
      .attr("transform", "translate(110,500)")
      .text("Region");

    g.append("text")
      .attr("transform", "translate(290,300)rotate(-90)")
      .text("Coffee Sales (USD)");
    g.append("text")
      .attr("transform", "translate(465,500)")
      .text("Product");

    g.append("text")
      .attr("transform", "translate(40,10)")
      .text("Coffee Sales by Region (USD)");
    g.append("text")
      .attr("transform", "translate(385,10)")
      .text("Coffee Sales by Product (USD)");





    ///////////////////////////////////////
    ///////////////////////////////////////
  });
