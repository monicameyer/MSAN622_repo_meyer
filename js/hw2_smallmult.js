
var margin = {top: 8, right: 10, bottom: 2, left: 10},
    width = (960 - margin.left - margin.right)/5,
    height = 200 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .range([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);

d3.csv("statex77.csv", function(data) {
    var states = d3.nest()
        .key(function(d){ return d.State; })
        .entries(data);

    x.domain(data.map(function(d) { return d.variable; }));
    y.domain([0, 25000]);

    var svg = d3.select("#chart-B").selectAll("svg")
        .data(states)
      .enter().append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .append("text")
        .attr("x", width + 10)
        .attr("y", height/3)
        .attr("dy", ".71em")
        .attr("text-anchor", "start")
        .attr("font-size", "1.1em")
        .text(function(d) { return d.key});

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

});
