var margin2 = {top: 40, right: 20, bottom: 20, left: 30},
  width2 = 150,
  height2 =  200 - margin2.top - margin2.bottom;

var x2 = d3.scale.ordinal()
  .rangeRoundBands([0, width2], .1);

var y2 = d3.scale.linear()
  .range([height2, 0]);

var xAxis = d3.svg.axis()
  .scale(x2)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y2)
  .orient("left")
  .ticks(5);

var colorScale = d3.scale.ordinal()
        .range(colorbrewer.Set1[4]);

var tip2 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.value + "</span>";
  });


d3.csv("statex77_2.csv", function(data) {

  var states = d3.nest()
      .key(function(d){ return d.State; })
      .entries(data);

  regions = {};
  for (var i = 0; i < states.length; i++){
    regions[states[i].values[3].State] = colorScale(states[i].values[3].value);
  }

  color_div = {};
  for (var i = 0; i < states.length; i++){
    color_div[states[i].values[3].value] = colorScale(states[i].values[3].value);
  }

  x2.domain(["Illiteracy", "Murder", "hsGrad"])
  y2.domain([0, 70]);

  var svg = d3.select("#chart-B").selectAll("svg")
      .data(states)
    .enter().append("svg:svg")
      .attr("width", width2 + margin2.left + margin2.right)
      .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  svg.call(tip2);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("x", .5*width2)
      .attr("y", 10)// height2 + 60)
      .attr("dy", "-.9em")
      .attr("text-anchor", "middle")
      .attr("font-size", "1.5em")
      .text(function(d) { return d.key});

  svg.selectAll(".bar")
      .data(function(d) { return d.values.slice(0, 4); })
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x2(d.variable); })
      .attr("width", x2.rangeBand())
      .attr("y", function(d) { return y2(d.value); })
      .attr("height", function(d) { return height2 - y2(d.value); })
      .attr("fill", function(d){ return regions[d.State]; })
      .attr("opacity", .8)
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis);

  // var legendSize = 18;
  // var legendSpace = 4;
  // var colors = d3.entries(color_div)

  // var legend = d3.select("#chart-B").selectAll('.legend')
  //     .data(colors)
  //     .enter()
  //     .append('g')
  //     .attr('class', 'legend')
  //     .attr('transform', function(d, i) { 
  //       // return 'translate(' + (width2 - 130) + ',' + (i * (legendSize + legendSpace)) + ')';
  //       return "translate(" + margin2.left + "," + margin2.top + ")";
  //       });

  // legend.append('rect')
  //     .attr('width', legendSize)
  //     .attr('height', legendSize)
  //     .style('fill', function(d) { return d.value; })
  //     .style('opacity', .8)
  //     .style('stroke', 'black');

  // legend.append('text')
  //     .attr('x', legendSize + legendSpace)
  //     .attr('y', legendSize - legendSpace)
  //     .text(function(d) { return d.key; });

});
