var margin2 = {top: 20, right: 100, bottom: 20, left: 30},
    width2 = 1100 - margin2.left - margin2.right,
    height2 = 150 - margin2.top - margin2.bottom;

var formatting = d3.format(",.0f");

var color = d3.scale.ordinal()
        .range(colorbrewer.Dark2[4]);

var plot_names = ["hsGrad", "Income", "Murder", "Illiteracy"];

var x2 = d3.scale.ordinal()
    .rangeRoundBands([0, width2 + 10], .1);

var y2 = d3.scale.linear()
    .range([height2, 0]);

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom")
    .outerTickSize(0)
    .innerTickSize(0);

var yAxis2 = d3.svg.axis()
    .scale(y2);

d3.json("../data/statex77.json", function(data) { 

    var opacity = d3.scale.linear()
          .domain([d3.min(data, function (d) { return d[name]; }), 
                   d3.max(data, function (d) { return d[name]; })])
          .range([1, .5]);

    var multiples = [];

    for (var i = 0; i < plot_names.length; i++) {
        var categories = d3.nest()
            .key(function(d) {return plot_names[i];})
            .entries(data);
        multiples[i] = categories[0];
    }

    x2.domain(data.map(function(d) { return d.Abb; }));
    
    var svg = d3.select("#chart-B").selectAll("svg")
        .data(multiples)
      .enter().append("svg:svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .attr("display", "block")
        .append("g")
        .attr("transform", "translate(10,"  + margin2.top + ")")
        .each(multiple);

    svg.append("g")
        .attr("class", "x axis2")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    svg.append("g")
        .append("text")
        .attr("x", width2 + 30)
        .attr("y", height2/2)
        .attr("dy", ".71em")
        .attr("text-anchor", "start")
        .attr("font-size", "1.1em")
        .text(function(d){ if (d.key == "hsGrad") { return "HS Grad Rate";} else { return d.key; } });


    var tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .direction('n')
        .html(function(d) {
          return "<span style='color:white font-size:14px'>"+ d.State +"</span><br>Region: <span style='color:" + color(d.Region) + "'>" + d.Region + "</span><br>HS Grad Rate: <span style='color:white'>" + formatting(d.hsGrad) + "</span><br>Income: <span style='color:white'>" + formatting(d.Income) + "</span><br>Murder: <span style='color:white'>" + d.Murder + "</span><br>Illiteracy: <span style='color:white'>" + d.Illiteracy + "</span><br>";
        });

    svg.call(tip2);

    function multiple(category) {
        var svg = d3.select(this);
        y2.domain([0, d3.max(category.values, function(d) { return d[category.key]; })]);
        svg.selectAll(".bar")
              .data(function(d) {return d.values;})
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x2(d.Abb); })
              .attr("width", x2.rangeBand())
              .attr("y", function(d) { return y2(d[category.key]); })
              .attr("height", function(d) { return height2 - y2(d[category.key]); })
              .style("fill", function(d) {return color(d.Region); })
              .on('mouseover', function (d) {
                  tip2.show(d);
                  fade(d.Region, .2);
              })
              .on('mouseout', function (d) {
                  tip2.hide(d);
                  fadeOut(d);
              });
        }

    function fade(state_region, opacity) {

        svg.selectAll("rect")
            .transition().duration(1500)
            .style("fill", function(d) {return color(d.Region); })
            .filter(function (d) { return d.Region != state_region; })
            .style("opacity", opacity);
    }

    function fadeOut() {
        svg.selectAll("rect")
            .transition().duration(2000)
            .style("fill", function(d) {return color(d.Region); })
            .style("opacity", function (d) { opacity(d.Region); });
    }

});

//-----------------------------------------------------------------------
//--------------------------50-States-Multiples--------------------------
//-----------------------------------------------------------------------


// var margin2 = {top: 40, right: 20, bottom: 20, left: 30},
//   width2 = 150,
//   height2 =  200 - margin2.top - margin2.bottom;

// var x2 = d3.scale.ordinal()
//   .rangeRoundBands([0, width2], .1);

// var y2 = d3.scale.linear()
//   .range([height2, 0]);

// var xAxis = d3.svg.axis()
//   .scale(x2)
//   .orient("bottom");

// var yAxis = d3.svg.axis()
//   .scale(y2)
//   .orient("left")
//   .ticks(5);

// var colorScale = d3.scale.ordinal()
//         .range(colorbrewer.Set1[4]);

// var tip2 = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-5, 0])
//   .html(function(d) {
//     return "<span style='color:white'>" + d.value + "</span>";
//   });


// d3.csv("statex77_2.csv", function(data) {

//   var states = d3.nest()
//       .key(function(d){ return d.State; })
//       .entries(data);

//   regions = {};
//   for (var i = 0; i < states.length; i++){
//     regions[states[i].values[3].State] = colorScale(states[i].values[3].value);
//   }

//   color_div = {};
//   for (var i = 0; i < states.length; i++){
//     color_div[states[i].values[3].value] = colorScale(states[i].values[3].value);
//   }

//   x2.domain(["Illiteracy", "Murder", "hsGrad"])
//   y2.domain([0, 70]);

//   var svg = d3.select("#chart-B").selectAll("svg")
//       .data(states)
//     .enter().append("svg:svg")
//       .attr("width", width2 + margin2.left + margin2.right)
//       .attr("height", height2 + margin2.top + margin2.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//   svg.call(tip2);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//       .attr("x", .5*width2)
//       .attr("y", 10)// height2 + 60)
//       .attr("dy", "-.9em")
//       .attr("text-anchor", "middle")
//       .attr("font-size", "1.5em")
//       .text(function(d) { return d.key});

//   svg.selectAll(".bar")
//       .data(function(d) { return d.values.slice(0, 4); })
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x2(d.variable); })
//       .attr("width", x2.rangeBand())
//       .attr("y", function(d) { return y2(d.value); })
//       .attr("height", function(d) { return height2 - y2(d.value); })
//       .attr("fill", function(d){ return regions[d.State]; })
//       .attr("opacity", .8)
//       .on('mouseover', tip2.show)
//       .on('mouseout', tip2.hide);

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height2 + ")")
//       .call(xAxis);
// });


