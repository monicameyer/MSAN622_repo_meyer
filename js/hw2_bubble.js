var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = 960 - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale = d3.scale.linear().domain([3000, 6400]).range([0, width]),
    yScale = d3.scale.linear().domain([0, 16]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 25000]).range([0, 40]);
    colorScale = d3.scale.category10();

var xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(xScale)
    .ticks(20, d3.format(",d"));

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Income");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "left")
    .attr("y", 7)
    .attr("x", 5)
    .text("Murder (per 100K Pop)");

svg.append("title")
    .attr("text-anchor", "end");
              
// Load the data.
d3.json("statex77.json", function(states) {
  
  states.forEach(function(d){
    d.color = colorScale(d.Region)
  })

  var dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(states)
    .enter().append("circle")
      .attr("class", "dot")
      .style("fill", function(d) { return colorScale(d.Region); })
      .call(position)
      .sort(order);

  // Add the state name for each dot.
  dot.append("title")
      .text(function(d) { return d.State; });

  // Positions the dots based on data.
  function position(dot) {
    dot .attr("cx", function(d) { return xScale(d.Income); })
        .attr("cy", function(d) { return yScale(d.Murder); })
        .attr("r", function(d) { return radiusScale(d.Population); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // Draw a legend to explain color of dots

  color_div = {}
  for  (var i = 0; i < states.length; i++)
  {
      color_div[states[i].Region] = states[i].color;
  };

  var legendRectSize = 18;
  var legendSpacing = 4;
  var colors = d3.entries(color_div)

  var legend = svg.selectAll('.legend')
      .data(colors)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
          var height = legendRectSize + legendSpacing;
          var offset =  height * colors.length;
          var horz = width - 130;
          var vert = i * height;
          return 'translate(' + horz + ',' + vert + ')';
        });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d) { return d.value; })
    .style('stroke', 'black');

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d.key; });

});
