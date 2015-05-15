var margin = {top: 19.5, right: 30, bottom: 19.5, left: 30},
    width = 560 - margin.right- margin.left,
    height = 400 - margin.top - margin.bottom;

var xScale = d3.scale.linear().domain([0, 1]).range([0, width]),
    yScale = d3.scale.linear().domain([-.1, 1]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 1]).range([5, 25]),
    colorScale = d3.scale.linear().domain([1, 2, 3, 4, 5])
          .range(["#fff5f0", "#fcbba1", "#fb6a4a", "#ef3b2c", "#a50f15"]);

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
    return "<span style='color:white font-size:14px'>"+ d.Neighborhood +"</span><br>Hazard Score: <span style='color:" + colorScale(d.Haz_Score) + "'>" + d.Haz_Score + "</span><br>Imp Per: <span style='color:white'>" + formatting(d.Imp_Per) + "</span><br>Liq_Per: <span style='color:white'>" + formatting(d.Liq_Per) + "</span><br>Heat Per: <span style='color:white'>" + formatting(d.Heat_Per) + "</span>";
  })

// "<span style='color:white font-size:14px'>"+ d.Neighborhood +"</span><br>Residential Score: <span style='color:" + color(d.Res_Score) + "'>" + d.Res_Score + "</span><br>Rent Per <span style='color:white'>" + formatting(d.Rent_Per) + "</span><br>AC Per: <span style='color:white'>" + formatting(d.AC_Per) + "</span><br>OC_Per: <span style='color:white'>" + formatting(d.OC_Per) + "</span><br>EldLivAl_Per: <span style='color:white'>" + formatting(d.EldLivAl_Per) + "</span><br>";


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
    .text("Imp Per");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "left")
    .attr("y", 7)
    .attr("x", 5)
    .text("Liq Per");
              
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
  var legendSpace = 22;
  var colors = d3.entries(color_div)

  var legend = svg.selectAll('.legend')
      .data(colors)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { 
        return 'translate(' + (30 + (i * (legendSize + legendSpace))) + ',' + 50 + ')';
        });

  legend.append('rect')
    .attr('width', legendSize)
    .attr('height', legendSize)
    .style('fill', function(d) { return d.value; })
    .style('opacity', .8)
    .style('stroke', 'black')
    .style('stroke-width', '.7px');

  legend.append('text')
    .attr('x', legendSize + 5)
    .attr('y', legendSize - 7)
    .text(function(d) { return d.key; });

  svg.append('text')
    .attr('x', 140)
    .attr('y', 35)
    .attr("text-anchor", "middle")
    .text('Hazard Score')
    .style('font-size', '13px');

});
