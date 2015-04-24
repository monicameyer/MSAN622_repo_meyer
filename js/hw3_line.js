var margin = {top: 20, right: 100, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var parseDate = d3.time.format("%b %Y").parse;

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
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.number); });

var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white font-size:14px'>" + d.label + " Killed or<br>Seriously Injured: "+ d.value +"</span><br>Date: <span style='color:white'>" + monthNames[(d.date).getMonth()-1]+" "+ (d.date).getFullYear()+"</span>";
  })

d3.csv("../data/seatbelts.csv", function(error, data) {

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var all_dots = [];

  for (var i = 0; i < data.length; i++){
    var data_points = {
      date: (data[i]).date,
      value: (data[i]).drivers,
      name: "drivers",
      label: "Drivers"
    };
    all_dots.push(data_points);
    var data_points2 = {
      date: (data[i]).date,
      value: (data[i]).front,
      name: "front",
      label: "Front Passengers"
    };
    all_dots.push(data_points2);
    var data_points3 = {
      date: (data[i]).date,
      value: (data[i]).rear,
      name: "rear",
      label: "Rear Passengers"
    };
    all_dots.push(data_points3);

  }

  var seatbelts = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, number: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([0 ,2700]);//d3.max(seatbelts, function(c) { return d3.max(c.values, function(v) { return v.number; }); }) ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.call(tip);

  var drivers = svg.selectAll(".drivers")
      .data(seatbelts)
    .enter().append("g")
      .attr("class", "drivers");

  drivers.append("path")
      .attr("id", function(d) { return d.name; })
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("text-anchor", "left")
      .attr("y", -10)
      .attr("x", -21)
      .text("Number of People Killed");

  svg.append("text")
      .attr("text-anchor", "left")
      .attr("y", 3)
      .attr("x", 5)
      .text("or Seriously Injured");

  var dot2 = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(all_dots)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.value); })
      .attr("r", 4)
      .style("fill", function(d) { return color(d.name);})
      .style("opacity", 0);

  dot2.on("mouseover", function(d){
          d3.select(this).style("opacity", 1)
          tip.show(d); })
      .on("mouseout", function(d){
          d3.select(this).style("opacity", 0)
          tip.hide(d); });

  drivers.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.number) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .attr("id", function(d) { return d.name; })
      .text(function(d) { 
        if (d.name == "front"){ return "Front Passengers"; }
        else if (d.name == "rear"){ return "Rear Passengers"; }
        else { return "Drivers"; }; });
  
  window.onload = d3.select("input#check1").property("checked", true)
                    .each(function(){
                      var opacity = this.checked ? 1 : 0;
                        d3.select("path#drivers").transition().duration(500)
                          .style("opacity", opacity); 
                        d3.select("text#drivers").transition().duration(500)
                          .style("opacity", opacity); }),
                  d3.select("input#check2").property("checked", true)
                    .each(function(){
                      var opacity = this.checked ? 1 : 0;
                        d3.select("path#front").transition().duration(500)
                          .style("opacity", opacity);
                        d3.select("text#front").transition().duration(500)
                          .style("opacity", opacity); }),
                  d3.select("input#check3").property("checked", true)
                    .each(function(){
                      var opacity = this.checked ? 1 : 0;
                        d3.select("path#rear").transition().duration(500)
                          .style("opacity", opacity);
                        d3.select("text#rear").transition().duration(500)
                          .style("opacity", opacity); });  

  d3.select("input#check1").on("change", function(){
    var opacity = this.checked ? 1 : 0;

    d3.select("path#drivers").transition().duration(500)
      .style("opacity", opacity);
    d3.select("text#drivers").transition().duration(500)
      .style("opacity", opacity);
  });

  d3.select("input#check2").on("change", function(){
    var opacity = this.checked ? 1 : 0;

    d3.select("path#front").transition().duration(500)
      .style("opacity", opacity);
    d3.select("text#front").transition().duration(500)
      .style("opacity", opacity);
  });

  d3.select("input#check3").on("change", function(){
    var opacity = this.checked ? 1 : 0;

    d3.select("path#rear").transition().duration(500)
      .style("opacity", opacity);
    d3.select("text#rear").transition().duration(500)
      .style("opacity", opacity);
  });


});




