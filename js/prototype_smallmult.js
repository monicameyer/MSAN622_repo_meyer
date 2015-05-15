var margin2 = {top: 10, right: 100, bottom: 10, left: 100},
    width2 = 1020 - margin2.left - margin2.right,
    height2 = 120 - margin2.top - margin2.bottom;

var formatting = d3.format(".0%")

var color = d3.scale.linear().domain([0, 1, 2, 3, 4, 5])
    // .range(["#fcfbfd", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f"]);
    // .range(["#f7fbff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#08519c"]);
    .range(["#fdae61","#fee08b","#abdda4","#66c2a5","#3288bd","#5e4fa2"]);
        // .range(colorbrewer.BuPu[6]);
        // .range(["#8dd3c7", "#bebada", "#80b1d3", "#fb8072", "#fdb462","#ffed6f"]);
// var color = d3.scale.linear().domain([1, 36]).range(["#a50026", "#313695"]).interpolate(d3.interpolateLab)

var plot_names = ["Rent_Per", "Dem_Score", "Res_Rank", "PTrans_Sco"];

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
          return "<span style='color:white font-size:14px'>"+ d.Neighborhood +"</span><br>Residential Score: <span style='color:" + color(d.Res_Score) + "'>" + d.Res_Score + "</span><br>Rent Per <span style='color:white'>" + formatting(d.Rent_Per) + "</span><br>Dem Score: <span style='color:white'>" + d.Dem_Score + "</span><br>Res_Rank: <span style='color:white'>" + d.Res_Rank + "</span><br>PTrans_Sco: <span style='color:white'>" + d.PTrans_Sco + "</span><br>";
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

