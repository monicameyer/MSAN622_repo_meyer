var m = {top: 30, right: 40, bottom: 20, left: 100},
    w = 1000 - m.right - m.left,
    h = 600 - m.top - m.bottom;

var colorScale3 = d3.scale.ordinal()
        .range(colorbrewer.Dark2[4]);

var line3 = d3.svg.line()
      .defined(function(d) { return !isNaN(d[1]); });

d3.csv("../data/statex77_parallel.csv", function(data) {
  var test = d3.entries(data[0])

  var dimensions = []
  for (var i = 0; i < test.length; i++){
    new_dim = {}

    if ((test[i]).key == "State" || (test[i]).key == "Region"){
      new_dim["name"] = (test[i]).key;
      new_dim["scale"] = d3.scale.ordinal().rangePoints([0, h]);
      new_dim["type"] = "string";
    } else {
      new_dim["name"] = (test[i]).key;
      new_dim["scale"] = d3.scale.linear().range([h, 0]);
      new_dim["type"] = "number";
    };

    dimensions[i] = new_dim;
  };

  var x3 = d3.scale.ordinal()
      .domain(dimensions.map(function(d) { return d.name; }))
      .rangePoints([0, w]);


  var yAxis3 = d3.svg.axis()
      .orient("left");

  var svg3 = d3.select("#chart-C").append("svg")
      .attr("width", w + m.left + m.right)
      .attr("height", h + m.top + m.bottom)
    .append("g")
      .attr("transform", "translate(" + m.left + "," + m.top + ")");

  var dimension = svg3.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x3(d.name) + ")"; });

    dimensions.forEach(function(dimension) {
      dimension.scale.domain(dimension.type === "number"
          ? d3.extent(data, function(d) { return +d[dimension.name]; })
          : data.map(function(d) { return d[dimension.name]; }).sort());
    });

    color_div3 = {}
    for  (var i = 0; i < data.length; i++)
    {
        color_div3[data[i].Region] = colorScale3(data[i].Region);
    };

    svg3.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", draw);

    svg3.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .style("stroke", function(d) { return color_div3[d.Region]; })
        .style("opacity", .9)
        .attr("d", draw);

    dimension.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(yAxis3.scale(d.scale)); })
      .append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { 
          if (d.name == "LifeExp"){ return "Life Expectancy"; }
          else if (d.name == "hsGrad"){ return "HS Grad Rate"; }
          else { return d.name; } })
        .each(moveToFront);

    svg3.select(".axis").selectAll("text:not(.title)")
        .attr("class", "label")
        .data(data, function(d) { return d.State || d; });

    var projection = svg3.selectAll(".label,.background path,.foreground path")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);


    function mouseover(d) {
      projection.classed("inactive", function(p) { return p !== d; });
      projection.filter(function(p) { return p === d; });//.each(moveToFront);
    }

    function mouseout(d) {
      projection.classed("inactive", false);
    }

    function moveToFront() {
      this.parentNode.appendChild(this);
    }

    function draw(d) {
        return line3(dimensions.map(function(dimension) {
          return [x3(dimension.name), dimension.scale(d[dimension.name])];
    }));
}

});


