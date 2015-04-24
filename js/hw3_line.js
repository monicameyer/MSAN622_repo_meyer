var margin = {top: 20, right: 100, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var parseDate = d3.time.format("%b %Y").parse;
    // bisectDate = d3.bisector(function(d) { return d.date; }).left;

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
    return "<span style='color:white font-size:14px'>"+d.name+" Killed or<br>Seriously Injured: "+ d.value +"</span><br>Date: <span style='color:white'>" +monthNames[(d.date).getMonth()]+" "+ (d.date).getFullYear()+"</span>";
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
      name: "Drivers"
    };
    all_dots.push(data_points);
    var data_points2 = {
      date: (data[i]).date,
      value: (data[i]).front,
      name: "Front Passengers"
    };
    all_dots.push(data_points2);
    var data_points3 = {
      date: (data[i]).date,
      value: (data[i]).rear,
      name: "Rear Passengers"
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
      .attr("r", 5)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style("fill", "white")
      .style("opacity", 0)
      .style("stroke", "black");

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

    // columns = d3.keys(data[0]).filter(function(key) { return key !== "date"; })

    // color_div = {}
    // for  (var i = 0; i < columns.length; i++)
    // {
    //     color_div[columns[i]] = color2(columns[i]);
    // };

    // var legendSize = 10;
    // var legendSpace = 40;
    // var colors = d3.entries(color_div)

    // var svg3 = d3.select("#chart1").append("svg")
    //     .attr("width", width1 + margin1.left + margin1.right)
    //     .attr("height", 100);

    // var legend = svg3.selectAll('.legend')
    //     .data(colors)
    //     .enter()
    //     .append('g')
    //     .attr('class', 'legend')
    //     .attr('transform', function(d, i) { 
    //       return 'translate(' + (width - 130) + ',' + (i * (legendSize + legendSpace)) + ')';
    //       // return 'translate(' + (330 + (i * (legendSize + legendSpace))) + ',' + 10 + ')';
    //       });

    // legend.append('rect')
    //     .attr('width', legendSize)
    //     .attr('height', legendSize)
    //     .style('fill', function(d) { return d.value; })
    //     .style('opacity', 1)
    //     .style('stroke', 'black');

    // legend.append('text')
    //     .attr('x', legendSize + legendSpace)
    //     .attr('y', legendSize - legendSpace)
    //     .text(function(d) { 
    //       if (d.key == "front"){ return "Front Passengers"; }
    //       else if (d.key == "rear"){ return "Rear Passengers"; }
    //       else { return "Drivers"; }; });
  
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




