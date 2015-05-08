var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1150 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

var bar = d3.select("#chart1").append("svg")
    .attr("id", "map_chart")
    .attr("width", (1/2)*width)
    .attr("height", (1/2)*height);

var scatter = d3.select("#chart1").append("svg")
    .attr("id", "bubble_chart")
    .attr("width", (1/2)*width)
    .attr("height", (1/2)*height);

var area = d3.select("#chart1").append("svg")
    .attr("id", "bar_chart")
    .attr("width", width)
    .attr("height", (1/2)*height);



function map_chart(){

    var m = {top: 0, right: 10, bottom: 20, left: 0},
        w = 550 - m.left - m.right,
        h = 450 - m.top - m.bottom;

    var svg = d3.select("#map_chart").append("g")
            .attr("transform", "translate(" + m.left + "," + m.top + ")");

    var projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
    var path = d3.geo.path().projection(projection);

    var valueById = d3.map();

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:white'>" + d.properties.neighborho + "</span>";
      })


    d3.json("../data/ne.json", function(error, sf) {
        console.log(sf);

        var featureCollection = topojson.feature(sf, sf.objects.planning_neighborhoods);
        var bounds = d3.geo.bounds(featureCollection);

        var centerX = d3.sum(bounds, function(d) {return d[0];}) / 2,
            centerY = d3.sum(bounds, function(d) {return d[1];}) / 2;

        var projection = d3.geo.mercator()
            .scale(150000)
            .center([centerX+.09, centerY]);

        var path = d3.geo.path().projection(projection);

        svg.selectAll("path")
            .data(featureCollection.features)
          .enter().append("path")
            .attr("d", path)
            // .attr("id", function(d){ console.log(d); })
          .style("fill", "white")
          .style("stroke", "black")
          .on("mouseover", function(d){
                d3.select(this).style("fill", "steelblue"); })
          .on("mouseout", function(d){
                d3.select(this).style("fill", "white"); });

        var dataCollection = sf.objects.community_resiliency;

        svg.selectAll(".subunit")
            .data(dataCollection)
          .enter().append("path")
            // .attr("class", function(d) { console.log(d);})
            .attr("d", path);




        // var bounds = path.bounds(sf);

        // xScale = w / Math.abs(bounds[1][0] - bounds[0][0]);
        // yScale = h / Math.abs(bounds[1][1] - bounds[0][1]);
        // scale = xScale < yScale ? xScale : yScale;

        // var transl = [(w - scale * (bounds[1][0] + bounds[0][0])) / 2, 
        //     (h - scale * (bounds[1][1] + bounds[0][1])) / 2];

        // projection.scale(scale).translate(transl);
        // svg.call(tip);



        // d3.json("../data/ne.json", function(error, data){
        //     console.log(data);

        //     var featureCollection = topojson.feature(data, data.objects.collection);
        //     var bounds = d3.geo.bounds(featureCollection);

        //     // var neighborhoods = d3.nest()
        //     //   .key(function(d) { return d.Neighborhood; })
        //     //   .entries(data);

        //     valueById.set(data.Neighborhood, data);
        //     // console.log(valueById);


        // })

        // var outlines = svg.append("g")
        //         .attr("class", "outlines")
        //     .selectAll(".path")
        //       .data(sf.features)
        //       .enter().append("path")
        //       .attr("d", path)
        //       .attr('id', function(d) { console.log(valueById.get(d.Neighborhood)); return d.properties.neighborho; })
        //       .style("fill", "white")
        //       .style("stroke", "black");

        // outlines.on("mouseover", function(d){
        //         d3.select(this).style("opacity", 0); })
        //      .on("mouseout", function(d){
        //         d3.select(this).style("opacity", 1); });

        




    });

};

function bar_chart(){

    var m = {top: 10, right: 100, bottom: 10, left: 20},
    w = 1100 - m.left - m.right,
    h = 110 - m.top - m.bottom;

    var formatting = d3.format(".0%")

    var color = d3.scale.linear().domain([0, 1, 2, 3, 4, 5])
        // .range(["#fdae61","#fee08b","#abdda4","#66c2a5","#3288bd","#5e4fa2"]);
        .range(["#ccebc5","#a8ddb5",  "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac"]);
    
    // var plot_names = ["Rent_Per", "Dem_Score", "Res_Rank", "PTrans_Sco"];
    // var plot_names = ["Tree_Per", "AT_Min", "PTrans_Sco", "Trans_Sco"]
    // var plot_names = ["HS_Per", "LivAl_Per", "Viol_Rate", "Rent_Per"] 
    var plot_names = ["Shelt_Rate", "PrevHos", "Over65_Per", "Res_Rank", "Viol_Rate"]
    // var plot_names = ["Under18_Per", "NonWhi_Per", "Pov_Per", "PopDens"]


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, w + 10], .1);

    var y = d3.scale.linear()
        .range([h, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .outerTickSize(0)
        .innerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y);

    d3.json("../data/community_resiliency.json", function(data) { 
        // console.log(d3.entries(data[0]));
        // plot_names = []
        // for (var i = 0; i < d3.entries(data[0]).length; i++){
        //     plot_names[i] = d3.entries(data[0])[i].key;
        // }
        // console.log(plot_names);

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

        x.domain(data.map(function(d) { return d.Neighborhood; }));
        
        var svg = d3.select("#bar_chart").selectAll("g")
            .data(multiples)
          .enter().append("g")
            .attr("transform", function(d, i){
                return "translate(" + m.left + "," + (i*100 + m.top) + ")";})
            .each(multiple);

        svg.append("g")
            .attr("class", "x axis2")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)
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
            .attr("x", w + 30)
            .attr("y", h/2)
            .attr("dy", ".71em")
            .attr("text-anchor", "start")
            .attr("font-size", "1.1em")
            .text(function(d){ if (d.key == "hsGrad") { return "HS Grad Rate";} else { return d.key; } });


        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .direction('n')
            .html(function(d) {
              return "<span style='color:white font-size:14px'>"+ d.Neighborhood +"</span><br>Residential Score: <span style='color:" + color(d.Res_Score) + "'>" + d.Res_Score + "</span><br>Rent Per <span style='color:white'>" + formatting(d.Rent_Per) + "</span><br>Dem Score: <span style='color:white'>" + d.Dem_Score + "</span><br>Res_Rank: <span style='color:white'>" + d.Res_Rank + "</span><br>PTrans_Sco: <span style='color:white'>" + d.PTrans_Sco + "</span><br>";
            });

        svg.call(tip);

        function multiple(category) {
            var svg = d3.select(this);
            y.domain([0, d3.max(category.values, function(d) { return d[category.key]; })]);
            svg.selectAll(".bar")
                  .data(function(d) {return d.values;})
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.Neighborhood); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d[category.key]); })
                  .attr("height", function(d) { return h - y(d[category.key]); })
                  .style("fill", function(d) {return color(d.Res_Score); })
                  .on('mouseover', function (d) {
                      tip.show(d);
                      fade(d.Res_Score, .2);
                  })
                  .on('mouseout', function (d) {
                      tip.hide(d);
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

};

function bubble_chart(){

    var m = {top: 80, right: 30, bottom: 20, left: 30},
        w = 500 - m.right- m.left,
        h = 450 - m.top - m.bottom;

    var xScale = d3.scale.linear().domain([0, 1]).range([0, w]),
        yScale = d3.scale.linear().domain([-.1, 1]).range([h, 0]),
        radiusScale = d3.scale.sqrt().domain([0, 1]).range([5, 25]),
        colorScale = d3.scale.linear().domain([1, 2, 3, 4, 5])
              // .range(["#fff5f0", "#fcbba1", "#fb6a4a", "#ef3b2c", "#a50f15"]);
              .range(["#a50f15", "#ef3b2c", "#fb6a4a", "#fcbba1", "#fff5f0"]);
    var formatting = d3.format(",.2f");

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


    var svg = d3.select("#bubble_chart").append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w)
        .attr("y", h - 6)
        .text("Imp Per");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -8)
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
            return 'translate(' + (30 + (i * (legendSize + legendSpace))) + ',' + 0 + ')';
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
        .attr('y', 7)
        .text(function(d) { return d.key; });

      svg.append('text')
        .attr('x', 120)
        .attr('y', -10)
        .attr("text-anchor", "middle")
        .text('Hazard Score')
        .style('font-size', '13px');

    });

};

function parallel_chart(){

    var m = {top: 30, right: 40, bottom: 20, left: 160},
        w = 1000 - m.right - m.left,
        h = 600 - m.top - m.bottom;

    // var colorScale3 = d3.scale.ordinal()
    //         .range(colorbrewer.Dark2[4]);

    var colorScale3 = d3.scale.linear()
            .domain([1, 36])
            // .range(["white", "tomato"])
            .range(["#fff7f3", "#7a0177"])
            .interpolate(d3.interpolateLab);

    var threshold = d3.scale.threshold()
        // .domain([0, 6, 9, 12, 15, 18, 21, 24, 27, 30, 36])
        .domain([6, 12, 18, 24, 30, 36])
        // .range(["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598",
        //         "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"])
        .range(["#a50026", "#fdae61", "#fee08b", "#d9ef8b", "#66bd63", "#006837"])

    var line3 = d3.svg.line()
          .defined(function(d) { return !isNaN(d[1]); });

    d3.csv("../data/community_resiliency_parallel.csv", function(data) {

      var test = d3.entries(data[0])

      var dimensions = []
      for (var i = 0; i < test.length; i++){
        new_dim = {}

        if ((test[i]).key == "Neighborhood"){
          new_dim["name"] = (test[i]).key;
          new_dim["scale"] = d3.scale.ordinal().rangePoints([0, h]);
          new_dim["type"] = "string";
        } else {
          new_dim["name"] = (test[i]).key;
          new_dim["scale"] = d3.scale.linear().range([h, 0]);
          new_dim["type"] = "number";
        };

        dimensions.push(new_dim);
      };

      var x3 = d3.scale.ordinal()
          .domain(dimensions.map(function(d) { return d.name; }))
          .rangePoints([0, w]);


      var yAxis3 = d3.svg.axis()
          .orient("left")
          .ticks(5);

      var svg3 = d3.select("#chart2").append("svg")
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
            color_div3[data[i].Res_Rank] = threshold(data[i].Res_Rank);
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
            .style("stroke", "#2b8cbe")//function(d) { return color_div3[d.Res_Rank]; })
            .style("opacity", 1)
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
            .data(data, function(d) { return d.Neighborhood || d; });

        var projection = svg3.selectAll(".label,.background path,.foreground path")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);


        function mouseover(d) {
          projection.classed("inactive", function(p) { return p !== d; });
          projection.filter(function(p) { return p === d; });
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
}




map_chart();

bubble_chart();

bar_chart();

parallel_chart();

