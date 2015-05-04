var margin2 = {top: 10, right: 100, bottom: 10, left: 30},
    width2 = 1100 - margin2.left - margin2.right,
    height2 = 120 - margin2.top - margin2.bottom;

var formatting = d3.format(".0%")

var color = d3.scale.ordinal()
        .range(colorbrewer.Dark2[8]);

var plot_names = ["Rent_Per", "AC_Per", "OC_Per", "EldLivAl_Per"];

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

d3.json("../data/community_resiliency.json", function(data) { 

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

    x2.domain(data.map(function(d) { return d.Neighborhood; }));
    
    var svg = d3.select("#chart2").selectAll("svg")
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
        .call(xAxis2)
        .selectAll("text")  
            .style("opacity", 0);
            // .style("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", ".15em")
            // .attr("transform", function(d) {
            //     return "rotate(-60)" ;
            //     });

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
          return "<span style='color:white font-size:14px'>"+ d.Neighborhood +"</span><br>Residential Score: <span style='color:" + color(d.Res_Score) + "'>" + d.Res_Score + "</span><br>Rent Per <span style='color:white'>" + formatting(d.Rent_Per) + "</span><br>AC Per: <span style='color:white'>" + formatting(d.AC_Per) + "</span><br>OC_Per: <span style='color:white'>" + formatting(d.OC_Per) + "</span><br>EldLivAl_Per: <span style='color:white'>" + formatting(d.EldLivAl_Per) + "</span><br>";
        });

    svg.call(tip2);

    function multiple(category) {
        var svg = d3.select(this);
        y2.domain([0, d3.max(category.values, function(d) { return d[category.key]; })]);
        svg.selectAll(".bar")
              .data(function(d) {return d.values;})
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x2(d.Neighborhood); })
              .attr("width", x2.rangeBand())
              .attr("y", function(d) { return y2(d[category.key]); })
              .attr("height", function(d) { return height2 - y2(d[category.key]); })
              .style("fill", function(d) {return color(d.Res_Score); })
              .on('mouseover', function (d) {
                  tip2.show(d);
                  fade(d.Res_Score, .2);
              })
              .on('mouseout', function (d) {
                  tip2.hide(d);
                  fadeOut(d);
              });
        }

    function fade(res_score, opacity) {

        svg.selectAll("rect")
            .transition().duration(1500)
            .style("fill", function(d) {return color(d.Res_Score); })
            .filter(function (d) { return d.Res_Score != res_score; })
            .style("opacity", opacity);
    }

    function fadeOut() {
        svg.selectAll("rect")
            .transition().duration(2000)
            .style("fill", function(d) {return color(d.Res_Score); })
            .style("opacity", function (d) { opacity(d.Res_Score); });
    }

});

