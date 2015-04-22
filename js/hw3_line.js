var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var parseDate = d3.time.format("%b %Y").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
        .range(colorbrewer.Dark2[4]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.number); });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white font-size:14px'>"+ d.date +"</span>";
  })

var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("../data/seatbelts.csv", function(error, data) {

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var seatbelts = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, number: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([0 ,d3.max(seatbelts, function(c) { return d3.max(c.values, function(v) { return v.number; }); }) ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of People Killed");

  var drivers = svg.selectAll(".drivers")
      .data(seatbelts)
    .enter().append("g")
      .attr("class", "drivers");

  drivers.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  drivers.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.number) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { 
        if (d.name == "front"){ return "Front Passengers"; }
        else if (d.name == "rear"){ return "Rear Passengers"; }
        else { return "Drivers"; }; });

});

