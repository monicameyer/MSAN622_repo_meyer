// var margin1 = {top: 10, right: 10, bottom: 100, left: 40},
//     margin2 = {top: 430, right: 10, bottom: 20, left: 40},
//     width1 = 960 - margin1.left - margin1.right,
//     height1 = 500 - margin1.top - margin1.bottom,
//     height2 = 500 - margin2.top - margin2.bottom;

// var parseDate2 = d3.time.format("%b %Y").parse;

// var x1 = d3.time.scale().range([0, width1]),
//     x2 = d3.time.scale().range([0, width1]),
//     y1 = d3.scale.linear().range([height1, 0]),
//     y2 = d3.scale.linear().range([height2, 0]);

// var xAxis1 = d3.svg.axis().scale(x1).orient("bottom"),
//     xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
//     yAxis1 = d3.svg.axis().scale(y1).orient("left");

// var brush = d3.svg.brush()
//     .x(x2)
//     .on("brush", brushed);

// var area = d3.svg.area()
//     .interpolate("monotone")
//     .x(function(d) { return x1(d.date); })
//     .y0(height1)
//     .y1(function(d) { return y1(d.total); });

// var area2 = d3.svg.area()
//     .interpolate("monotone")
//     .x(function(d) { return x2(d.date); })
//     .y0(height2)
//     .y1(function(d) { return y2(d.total); });

// var svg2 = d3.select("#chart2").append("svg")
//     .attr("width", width1 + margin1.left + margin1.right)
//     .attr("height", height1 + margin1.top + margin1.bottom);

// svg2.append("defs").append("clipPath")
//     .attr("id", "clip")
//   .append("rect")
//     .attr("width", width1)
//     .attr("height", height1);

// var focus = svg2.append("g")
//     .attr("class", "focus")
//     .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// var context = svg2.append("g")
//     .attr("class", "context")
//     .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// d3.csv("../data/seatbelts_totals.csv", type, function(error, data) {
//   x1.domain(d3.extent(data.map(function(d) { return d.date; })));
//   y1.domain([0, d3.max(data.map(function(d) { return d.total; }))]);
//   x2.domain(x1.domain());
//   y2.domain(y1.domain());

//   focus.append("path")
//       .datum(data)
//       .attr("class", "area")
//       .attr("d", area);

//   focus.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height1 + ")")
//       .call(xAxis1);

//   focus.append("g")
//       .attr("class", "y axis")
//       .call(yAxis1);

//   context.append("path")
//       .datum(data)
//       .attr("class", "area")
//       .attr("d", area2);

//   context.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height2 + ")")
//       .call(xAxis2);

//   context.append("g")
//       .attr("class", "x brush")
//       .call(brush)
//     .selectAll("rect")
//       .attr("y", -6)
//       .attr("height", height2 + 7);
// });

// function brushed() {
//   x1.domain(brush.empty() ? x2.domain() : brush.extent());
//   focus.select(".area").attr("d", area);
//   focus.select(".x.axis").call(xAxis1);
// }

// function type(d) {
//   d.date = parseDate(d.date);
//   d.total = +d.total;
//   return d;
// }

//------------------------------------------------------------------------

var margin1 = {top: 10, right: 90, bottom: 100, left: 40},
    margin2 = {top: 430, right: 90, bottom: 20, left: 40},
    width1 = 960 - margin1.left - margin1.right,
    height1 = 500 - margin1.top - margin1.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate2 = d3.time.format("%b %Y").parse;

var color2 = d3.scale.ordinal()
        .range(colorbrewer.Dark2[4]);

var x1 = d3.time.scale().range([0, width1]),
    x2 = d3.time.scale().range([0, width1]),
    y1 = d3.scale.linear().range([height1, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis1 = d3.svg.axis().scale(x1).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis1 = d3.svg.axis().scale(y1).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x1(d.date); })
    .y0(function(d) { return y1(d.y0); })
    .y1(function(d) { return y1(d.y0 + d.y); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(function(d) { return y2(d.y0); })
    .y1(function(d) { return y2(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

var svg2 = d3.select("#chart2").append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom);

svg2.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width1)
      .attr("height", height1);

var focus = svg2.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var context = svg2.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("../data/seatbelts.csv", function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate2(d.date);
  });

  var drivers = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, y: +d[name]};
      })
    };
  }));

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
  x1.domain(d3.extent(data.map(function(d) { return d.date; })));
  y1.domain([0, 2000]);
  x2.domain(d3.extent(data, function(d) { return d.date; }));
  y2.domain([0, 2000]);

  focus.selectAll("path")
      .data(drivers)
    .enter().append('path')
      .attr('clip-path', 'url(#clip)')
      .attr("d", function(d) { return area(d.values); })
      .attr('class', 'focus')
      .style("fill", function(d) { return color(d.name); });

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height1 + ")")
      .call(xAxis1);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis1);

  context.selectAll("path")
      .data(drivers)
    .enter().append('path')
      .attr('class', 'context')
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { return color(d.name); });

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", 6)
      .attr("height", height2 );

  // focus.append("text")
  //     // .data(drivers)
  //     .datum(function(d) { 
  //       console.log(d.name);
  //       return {name: d.name, value: d.values[d.values.length - 1]}; })
  //     .attr("transform", function(d) { return "translate(" + x2(d.value.date) + "," + y2(d.value.y0 + d.value.y) + ")"; })
  //     .attr("x", 5)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "start")
  //     .text(function(d) { return d.name; });

});

function brushed() {
  x1.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.selectAll("path.focus").attr("d", function(d) { return area(d.values); });
  focus.select(".x.axis").call(xAxis1);
}

