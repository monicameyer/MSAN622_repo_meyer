var margin = {top: 45, right: 35, bottom: 45, left: 35},
  width = 280,
  height =  290 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5);

d3.csv("statex77.csv", function(data) {
  var states = d3.nest()
      .key(function(d){ return d.State; })
      .entries(data);

  x.domain(data.map(function(d) { return d.variable; }));
  y.domain([0, 200]);

  var svg = d3.select("#chart-B").selectAll("svg")
      .data(states)
    .enter().append("svg:svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis)
  //     .append("text")
  //     .attr("x", height - 400)
  //     .attr("y", width + 40)
  //     .attr("transform", "rotate(-90)" )
  //     .attr("dy", "-.9em")
  //     .attr("text-anchor", "start")
  //     .attr("font-size", "1.5em")
  //     .text(function(d) { return d.key});

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("x", .5*width)
      .attr("y", 10)// height + 60)
      .attr("dy", "-.9em")
      .attr("text-anchor", "middle")
      .attr("font-size", "1.5em")
      .text(function(d) { return d.key});

  // svg.append("title")
  //     .attr("text-anchor", "end");

  svg.selectAll(".bar")
      .data(function(d) { return d.values; })
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.variable); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "steelblue");

    // svg.append("title")
    //   .text(function(d) { return y(d.value); });

});
