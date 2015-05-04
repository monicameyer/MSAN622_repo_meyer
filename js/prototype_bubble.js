var margin = {top: 19.5, right: 30, bottom: 19.5, left: 30},
    width = 600 - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale = d3.scale.linear().domain([0, 1]).range([0, width]),
    yScale = d3.scale.linear().domain([-.1, 1]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 1]).range([5, 30]),
    colorScale = d3.scale.ordinal().domain([1, 5])
        .range(colorbrewer.Dark2[8]);

var formatting = d3.format(",.0f");

var xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(xScale);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white font-size:14px'>"+ d.State +"</span><br>Population: <span style='color:white'>" + formatting(d.Population) + "</span><br>Income: <span style='color:white'>" + formatting(d.Income) + "</span><br>Murder: <span style='color:white'>" + d.Murder + "</span>";
  })

var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

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
              
// Load the data.
d3.json("../data/community_resiliency.json", function(states) {
  
  states.forEach(function(d){
    d.color = colorScale(d.Haz_Score)
  })

  var dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(states)
    .enter().append("circle")
      .attr("class", "dot")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style("fill", function(d) { return colorScale(d.Haz_Score); })
      .call(position)
      .sort(order);

  // Positions the dots based on data.
  function position(dot) {
    dot .attr("cx", function(d) { return xScale(d.Imp_Per); })
        .attr("cy", function(d) { return yScale(d.Liq_Per); })
        .attr("r", function(d) { return radiusScale(d.Heat_Per); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return b.Heat_Per - a.Heat_Per;
  }

  // Draw a legend to explain color of dots

  color_div = {}
  for  (var i = 0; i < states.length; i++)
  {
      color_div[states[i].Haz_Score] = states[i].color;
  };

  var legendSize = 18;
  var legendSpace = 4;
  var colors = d3.entries(color_div)

  var legend = svg.selectAll('.legend')
      .data(colors)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { 
        return 'translate(' + (width - 130) + ',' + (i * (legendSize + legendSpace)) + ')';
        });

  legend.append('rect')
    .attr('width', legendSize)
    .attr('height', legendSize)
    .style('fill', function(d) { return d.value; })
    .style('opacity', .8)
    .style('stroke', 'black');

  legend.append('text')
    .attr('x', legendSize + legendSpace)
    .attr('y', legendSize - legendSpace)
    .text(function(d) { return d.key; });

});
