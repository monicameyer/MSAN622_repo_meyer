var width = 800,
    height = 500;

var svg3 = d3.select("#chart3").append("svg")
    .attr("width", width)
    .attr("height", height);

// var projection = d3.geo.mercator()
//     .scale(500)
//     .translate([width / 2, height / 2]);
// var projection = d3.geo.albers()
//     .center([0, 55.4])
//     .rotate([4.4, 0])
//     .parallels([50, 60])
//     .scale(6000)
//     .translate([width / 2, height / 2]);

// var path = d3.geo.path()
//     .projection(projection);

var projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
var path = d3.geo.path().projection(projection);



d3.json("../data/neighborhoods.json", function(error, data) {

    var bounds = path.bounds(data);

    xScale = width / Math.abs(bounds[1][0] - bounds[0][0]);
    yScale = height / Math.abs(bounds[1][1] - bounds[0][1]);
    scale = xScale < yScale ? xScale : yScale;

    var transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, 
        (height - scale * (bounds[1][1] + bounds[0][1])) / 2];

    projection.scale(scale).translate(transl);


    svg3.selectAll("path")
      .data(data.features)
      .enter().append("path")
      .attr("d", path)
      .attr('data-id', function(d) {
          console.log(d.id);
          return d.id;
      })
      .attr('data-name', function(d) {
          console.log(d.properties.name);
          return d.properties.name;
      })
      .style("fill", "white")
      .style("stroke", "black");

});









