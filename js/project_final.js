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

var text = d3.select("#chart1").append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var area = d3.select("#chart1").append("svg")
    .attr("id", "bar_chart")
    .attr("width", width)
    .attr("height", (1/2)*height);

text.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height-300)
    .attr("fill", "black")
    .style("font-size","18px")
    .text("Residential Living Conditions by Resiliency Score");


function map_chart(){

    var m = {top: 20, right: 0, bottom: 0, left: 0},
        w = 575 - m.left - m.right,
        h = 600 - m.top - m.bottom;

    var svg = d3.select("#map_chart").append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    var projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
    var path = d3.geo.path().projection(projection);
    var formatting = d3.format(",.0%");

    var valueById1 = d3.map();
    var valueById2 = d3.map();
    var valueById3 = d3.map();
    var valueById4 = d3.map();
    var valueById5 = d3.map();
    var valueById6 = d3.map();

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            value = d3.select("select").property("value")
            if (d.id == "Golden Gate Park"){
                var select_value = "N/A"
            }
            else {
                if (value == "Crime") { var select_value = valueById1.get(d.id); }
                else if (value == "Overcrowding") { var select_value = formatting(valueById2.get(d.id)); }
                else if (value == "Poverty") {var select_value = formatting(valueById3.get(d.id)); }
                else if (value == "Education") {var select_value = formatting(valueById4.get(d.id)); }
                else if (value == "Employment") { var select_value = formatting(valueById5.get(d.id)); }
                else if (value == "Community Score") {var select_value = valueById6.get(d.id); }
                else {var select_value = "N/A"}
            }
            return "<span style='color:white'tooltip here: >" + (d.id).replace(/_/g, ' ') + "<br>" + value + ": " + select_value + "</span>";
        });

    var quantize1 = d3.scale.threshold()
        .domain([10, 30, 70, 180, 300])
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);
    var quantize2 = d3.scale.quantize()
        .domain([0,0.25])
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);
    var quantize3 = d3.scale.quantize()
        .domain([0,0.56])
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);
    var quantize4 = d3.scale.threshold()
        .domain([0.5, .7, .8, .9, 1])
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);
    var quantize5 = d3.scale.threshold()
        .domain([0.85, .9, .92, .95, 1])
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);
    var quantize6 = d3.scale.quantize()
        .domain([1, 5])
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);

    optionlist = ["VCrim_Rate","OC_Per","Pov_Per", "HS_Per", "Emp_per", "Com_Score"];

    var select = d3.select("#drop_down")
        .append("select")
        .attr("class", "select")
        .on("change",filter)
 
    var options = select
        .selectAll("option")
        .data(optionlist).enter()
        .append("option")
        .text(function (d) { 
            if (d == "VCrim_Rate") { return "Crime"; }
            else if (d == "Com_Score") { return "Community Score"; }
            else if (d == "OC_Per") { return "Overcrowding"; }
            else if (d == "Pov_Per") { return "Poverty"; }
            else if (d == "HS_Per") { return "Education"; }
            else                    { return "Employment"; }
        });


    d3.json("../data/planning_neighborhoods.json", function(sf) {

        var featureCollection = topojson.feature(sf, sf.objects.planning_neighborhoods);
        var bounds = d3.geo.bounds(featureCollection);

        var centerX = d3.sum(bounds, function(d) {return d[0];}) / 2,
            centerY = d3.sum(bounds, function(d) {return d[1];}) / 2;

        var projection = d3.geo.mercator()
            .scale(180000)
            .center([centerX+.07, centerY+.005]);

        var path = d3.geo.path().projection(projection);

        var dataCollection = sf.objects.community_resiliency;
        dataCollection.forEach(function(d){
            d.Neighborhood = (d.Neighborhood).replace(/ /g, '_');
        })

        for (var i = 0; i < dataCollection.length; i++){
            valueById1.set(dataCollection[i].Neighborhood, +dataCollection[i].VCrim_Rate );
            valueById2.set(dataCollection[i].Neighborhood, +dataCollection[i].OC_Per );
            valueById3.set(dataCollection[i].Neighborhood, +dataCollection[i].Pov_Per );
            valueById4.set(dataCollection[i].Neighborhood, +dataCollection[i].HS_Per );
            valueById5.set(dataCollection[i].Neighborhood, +dataCollection[i].Emp_per );
            valueById6.set(dataCollection[i].Neighborhood, +dataCollection[i].Com_Score );
        };

        var neighborhoods = [];
        featureCollection.features.forEach(function(d) {
            d.id = (d.id).replace(/ /g, '_');
            neighborhoods.push(d.id)
        });

        svg.selectAll("path")
            .data(featureCollection.features)
          .enter().append("path")
            .attr("d", path)
            .attr("id", function(d){ return d.id; })
          .style("fill", function(d){ 
              if (typeof(valueById1.get(d.id)) == "number") { return quantize1(valueById1.get(d.id)); }
                  else { return "#d9d9d9"; } })
          .style("stroke", "black");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", w/2)
            .attr("y", 10)
            .text("Violent Crimes, Per 1000 People")
            .style("font-size","18px");

        svg.call(tip);

        svg.selectAll("path")
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);


        svg.selectAll("path")
            .on("click", function(d){
                var id = d3.select(this).attr("id");
                var index = neighborhoods.indexOf(id);
                var new_n = neighborhoods.slice(0);
                new_n.splice(index, 1);
                new_n.push("Mission_Bay");

                var opacity = d3.select("path#" + new_n[0]).style("opacity");
                console.log(opacity);
                if (opacity == 1){
                    d3.selectAll("circle#" + id).transition().duration(800)
                        .style("opacity", 1);
                    d3.selectAll("path#" + id).transition().duration(800)
                        .style("opacity", 1);
                
                    for (var i = 0; i < new_n.length; i++){
                        d3.selectAll("circle#" + new_n[i]).transition().duration(800)
                            .style("opacity", .1);
                        d3.selectAll("path#" + new_n[i]).transition().duration(800)
                            .style("opacity", .1); 
                    }
                } 
                else {
                    d3.selectAll("circle").transition().duration(800)
                        .style("opacity", 1);
                    d3.selectAll("path").transition().duration(800)
                        .style("opacity", 1);
                };
            });
    });

    function filter() {
        var val = d3.select("select").property("value");
        svg.select("text").remove();
        svg.selectAll("path")
            .attr("opacity", 1)
            .style("fill", function(d){ 
              if (val == "Crime") {
                  if (typeof(valueById1.get(d.id)) == "number") { return quantize1(valueById1.get(d.id)); }
                  else { return "#d9d9d9"; }
              } else if (val == "Overcrowding") {
                  if (typeof(valueById2.get(d.id)) == "number") { return quantize2(valueById2.get(d.id)); }
                  else { return "#d9d9d9"; }
              } else if (val == "Poverty") {
                  if (typeof(valueById3.get(d.id)) == "number") { return quantize3(valueById3.get(d.id)); }
                  else { return "#d9d9d9"; }
              } else if (val == "Education") {
                  if (typeof(valueById4.get(d.id)) == "number") { return quantize4(valueById4.get(d.id)); }
                  else { return "#d9d9d9"; }
              } else if (val == "Community Score") {
                  if (typeof(valueById6.get(d.id)) == "number") { return quantize6(valueById6.get(d.id)); }
                  else { return "#d9d9d9"; }
              } else { 
                  if (typeof(valueById5.get(d.id)) == "number") { return quantize5(valueById5.get(d.id)); }
                  else { return "white"; } };
            });
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", w/2)
            .attr("y", 10)
            .text(function(d){ 
                if (val == "Crime") { return "Violent Crimes, Per 1000 People"; } 
                else if (val == "Overcrowding") { return "Percent Households with 1 or More Person Per Room"; }
                else if (val == "Poverty") { return "Percent People Living Under 200% of the Poverty Line"; }
                else if (val == "Education") { return "Percent High School Graduates"; }
                else if (val == "Community Score") { return "Community Score"; }
                else { return "Percent of Population over 16 that are Employed"; }
            })
            .style("font-size","18px");
    }

};

function bar_chart(){

    var m = {top: 10, right: 100, bottom: 10, left: 180},
        w = 1100 - m.left - m.right,
        h = 110 - m.top - m.bottom;

    var formatting = d3.format(".0%")

    var color = d3.scale.linear().domain([1, 2, 3, 4, 5])
        .range(["#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    // var plot_names = ["Shelt_Rate", "PrevHos", "Over65_Per", "Res_Rank", "PTrans_Sco", "AT_Min"];
    var plot_names = ["LivAl_Per", "Viol_Rate", "Rent_Per","PrevHos", "AT_Min"];


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, w + 10], .1);

    var y = d3.scale.linear()
        .range([h, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y);

    var scaleNum = d3.map()

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

        for (var i = 0; i < data.length; i++){
            scaleNum.set(data[i].Neighborhood, data[i].Res_Score);
        }

        x.domain(data.map(function(d) { return d.Neighborhood; }));

        var svg = d3.select("#bar_chart").selectAll("g")
            .data(multiples)
          .enter().append("g")
            .attr("transform", function(d, i){
                return "translate(" + m.left + "," + (i*100 + m.top) + ")";})
            .each(multiple);

        svg.append("g")
            .append("text")
            .attr("x", -10)
            .attr("y", h/2)
            .attr("dy", ".71em")
            .attr("text-anchor", "end")
            .attr("font-size", "12px")
            .text(function(d){  //return d.key;
                if (d.key == "LivAl_Per") { return "Percent Living Alone"; }
                else if (d.key == "Viol_Rate") { return "Residential Violations"; }
                else if (d.key == "Rent_Per") { return "Rent Over 50% Income"; }
                else if (d.key == "PrevHos") { return "Preventable Hospitalizations"; }
                else if (d.key == "AT_Min") { return "Average Active Minutes"; }
            });

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .direction('n')
            .html(function(d) {
                return "<span style='color:#F0F8FF font-size:14px'>"+ d.Neighborhood + 
                "</span><br>Resiliency Score: <span style='color:" + color(d.Res_Score) + 
                "'>" + d.Res_Score + "</span><br>Percent Residents Living Alone: <span style='color:#F0F8FF'>" + 
                formatting(d.LivAl_Per) + "</span><br>Residential Violations<br>(Per 1000 Residents): <span style='color:#F0F8FF'>" + d.Viol_Rate +
                "</span><br>Rent Over 50% Monthly Income: <span style='color:#F0F8FF'>" + formatting(d.Rent_Per) +
                "</span><br>Preventable Hospitalizations<br>(Per 100K Residents): <span style='color:#F0F8FF'>" + 
                d.PrevHos + "</span><br>Average Active Minutes Per Resident: <span style='color:#F0F8FF'>" + d.AT_Min + "</span>";
            });

        svg.call(tip);

        function multiple(category) {
            var svg = d3.select(this);
            y.domain([0, d3.max(category.values, function(d) { return +d[category.key]; })]);
            svg.selectAll(".bar")
                .data(function(d) {return d.values;})
              .enter().append("rect")
                .attr("class", "bar")
                .attr("id", function(d){ return d.Neighborhood; })
                .attr("id2", function(d) { return category.key; })
                .attr("x", function(d) { return x(d.Neighborhood); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { 
                    if (!isNaN(d[category.key]) ){ return y(+d[category.key]); }
                    else { return 0; } })
                .attr("height", function(d) { 
                    if (!isNaN(d[category.key]) ){ return h - y(+d[category.key]); }
                    else { return 0; } })
                .style("fill", function(d) {return color(d.Res_Score); })
                .on('mouseover', function (d) {
                    tip.show(d);
                    fadeOut(d.Neighborhood);
                })
                .on('mouseout', function (d) {
                    tip.hide(d);
                    fadeIn(d.Neighborhood);
                });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis)
                .selectAll("text")  
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("opacity", function(d){ 
                        if (category.key == "AT_Min"){ return 1; }
                        else { return 0};
                    })
                    .attr("transform", function(d) {
                        return "rotate(-50)" 
                        });
            }

        function fadeOut(neighborhood) {
            res_score = scaleNum.get(neighborhood);
            svg.selectAll("rect")
                .style("opacity", 1)
                .transition().delay(200)
                .filter(function (d) { return d.Res_Score != res_score; })
                .attr("fill", function(d){ return "#ccc"; })
                .style("opacity", .1);
        }

        function fadeIn(neighborhood) {
            res_score = scaleNum.get(neighborhood);
            svg.selectAll("rect")
                .transition().delay(200)//.duration(400)
                .attr("fill", function(d){ return color(d.Res_Score); })
                .style("opacity", 1);
        }

    });

};

function bubble_chart(){

    var m = {top: 80, right: 100, bottom: 20, left: 40},
        w = 575 - m.right- m.left,
        h = 550 - m.top - m.bottom;

    var xScale = d3.scale.linear().domain([0, 1]).range([0, w]),
        yScale = d3.scale.linear().domain([-.15, 1]).range([h, 0]),
        radiusScale = d3.scale.sqrt().domain([0, 1]).range([5, 25]),
        colorScale = d3.scale.linear().domain([1, 2, 3, 4, 5])
            .range(["#a50f15", "#ef3b2c", "#fb6a4a", "#fcbba1", "#fee0d2"]);

    var formatting = d3.format(",.0%");

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale)
        .tickFormat(formatting);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(formatting);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<span style='color:#F0F8FF'>"+ (d.Neighborhood).replace(/_/g, ' ') +
            "</span>, Overall Environment Score: <span style='color:" + colorScale(d.Env_Score) + "'>" + d.Env_Score + 
            "</span><br>Impervious Surfaces: <span style='color:#F0F8FF font-size:14px'>" + formatting(d.Imp_Per) + 
            "</span><br>Heat Vulnerability: <span style='color:#F0F8FF font-size:14px'>" + formatting(d.Heat_Per) + 
            "</span><br>Percent land area within .25 miles <br>  of a contamination risk: <span style='color:#F0F8FF font-size:14px'>" + 
            formatting(d.Tox_Per) + "</span>";
        })

    var svg = d3.select("#bubble_chart").append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", w/2)
        .attr("y", -50)
        .text("Environmental Factors Affecting Neighborhood Resiliency")
        .style("font-size","18px");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w)
        .attr("y", h - 6)
        .style("font-size", "12px")
        .text("Percent Impervious Surface");

    svg.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .text("Percent Area in High Heat Vulnerability Zones");

    d3.json("../data/community_resiliency.json", function(data) {
        
        var neighborhoods = []
        data.forEach(function(d){
            d.color = colorScale(d.Haz_Score)
            d.Neighborhood = (d.Neighborhood).replace(/ /g, '_');
            neighborhoods.push(d.Neighborhood);
        })

        var dot = svg.append("g")
            .attr("class", "dot")
          .selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("id", function(d){ return d.Neighborhood; })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr("fill", function(d) { return colorScale(d.Env_Score); })
            .call(position)
            .sort(order);

        dot.on("click", function(d){
            var id = d3.select(this).attr("id");
            var index = neighborhoods.indexOf(id);
            var new_n = neighborhoods.slice(0);
            new_n.splice(index, 1);
            new_n.push("Golden_Gate_Park");

            var opacity = d3.select("circle#" + new_n[0]).style("opacity");
            if (opacity == 1){
            
                for (var i = 0; i < new_n.length; i++){
                    d3.selectAll("circle#" + id).transition().duration(800)
                        .style("opacity", 1);
                    d3.selectAll("path#" + id).transition().duration(800)
                        .style("opacity", 1);

                    d3.selectAll("circle#" + new_n[i]).transition().duration(800)
                        .style("opacity", .1);
                    d3.selectAll("path#" + new_n[i]).transition().duration(800)
                        .style("opacity", .1); 
                }
            } 
            else {
                d3.selectAll("circle").transition().duration(800)
                    .style("opacity", 1);
                d3.selectAll("path").transition().duration(800)
                    .style("opacity", 1);
            };
        });

        // Positions the dots based on data.
        function position(dot) {
            dot .attr("cx", function(d) { return xScale(d.Imp_Per); })
                .attr("cy", function(d) { return yScale(d.Heat_Per); })
                .attr("r", function(d) { 
                    if (d.Neighborhood == "Mission_Bay") { return 0; }
                    else { return radiusScale(d.Tox_Per); } });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
            return b.Tox_Per - a.Tox_Per;
        }

        // Draw a legend to explain color of dots

        color_div = {}
        for  (var i = 0; i < data.length; i++)
        {
            color_div[data[i].Haz_Score] = data[i].color;
        };

        var legendSize = 18;
        var legendSpace = 2;
        var colors = d3.entries(color_div)

        var legend = svg.selectAll('.legend')
            .data(colors)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) { 
                return 'translate(' + (60 + (i * (legendSize + legendSpace))) + ',' + 20 + ')';
            });

        legend.append('rect')
            .attr('width', legendSize)
            .attr('height', legendSize)
            .style('fill', function(d) { return d.value; })
            .style('opacity', .8)
            .style('stroke', 'black')
            .style('stroke-width', '.7px');

        legend.append('text')
            .attr('x', legendSize - 11)
            .attr('y', 28)
            .text(function(d) { return d.key; });

        svg.append('text')
            .attr('x', 110)
            .attr('y', 15)
            .attr("text-anchor", "middle")
            .text('Environment Score')
            .style('font-size', '13px');

        var percent = [1, .75, .5, .25, 0];

        svg.append("text")
            .attr("text-anchor", "start")
            .attr("x", 80)
            .attr("y", 65)
            .text("Size Scale")
            .style('font-size', '13px');

        var legendPopBox1 = svg.append("g")
                .attr("class", "legend")
            .selectAll(".legend")
                .data(percent)
                .enter().append("g");

        legendPopBox1.append("circle")
            .attr("cx", 100)
            .attr("cy", function(d, i) { 
                return 120 + i - .9*radiusScale(d); 
            })
            .attr("r", function(d) { return radiusScale(d); })
            .attr("fill", "white")
            .attr("stroke", "black");

        legendPopBox1.append("text")
            .attr("text-anchor", "start")
            .attr("x", 130)
            .attr("y", function(d, i) { 
                return 80 + 11*i; 
            })
            .text(function(d) { return formatting(d); });

    });

};

function parallel_chart(){
    //http://bl.ocks.org/mbostock/7586334

    var m = {top: 30, right: 50, bottom: 20, left: 120},
        w = 1100 - m.right - m.left,
        h = 500 - m.top - m.bottom;

    var x = d3.scale.ordinal().rangePoints([0, w], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line().defined(function(d) { return !isNaN(d[1]); }),
        axis = d3.svg.axis().orient("left").ticks(5),
        axis2 = d3.svg.axis().orient("left").ticks(11);

    var colorscale = d3.scale.ordinal()
        .domain([1, 2, 3, 4, 5])
        .range(["#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    d3.csv("../data/community_resiliency_parallel.csv", function(data) {

        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {

            if (d == "Neighborhood") {
                y[d] = d3.scale.ordinal()
                    .domain(data.map(function(p) { return p[d]; }))
                    .rangePoints([0, h]);
            } else {
                y[d] = d3.scale.linear()
                    .domain(d3.extent(data, function(p) { return +p[d]; }))
                    .range([h, 0]);

            }
            return true;
        }));

        var svg = d3.select("#chart2").append("svg")
            .attr("width", w + m.left + m.right)
            .attr("height", h + m.top + m.bottom)
          .append("g")
            .attr("transform", "translate(" + m.left + "," + m.top + ")");

        var background = svg.append("g")
            .attr("class", "background")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);

        var foreground = svg.append("g")
            .attr("class", "foreground")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .style("stroke", function(d) { return colorscale(d.Res_Score); })
            .style("opacity", 1)
            .attr("d", path);

        // Add a group element for each dimension
        var dimension = svg.selectAll(".dimension")
            .data(dimensions)
          .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });


        // Add an axis and title.
        dimension.append("g")
            .attr("class", "axis")
            .each(function(d) { 
                if (d == "District" || d == "Res_Rank"){ d3.select(this).call(axis2.scale(y[d])); }
                else { d3.select(this).call(axis.scale(y[d])); }  })
          .append("text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { 
                if (d == "Haz_Score") { return "Hazard"; } 
                else if (d == "Env_Score") { return "Environment"; }
                else if (d == "Trans_Sco") { return "Transportation"; }
                else if (d == "Com_Score") { return "Community"; }
                else if (d == "PR_Score") { return "Public Realm"; }
                else if (d == "House_Score") { return "Housing"; }
                else if (d == "Ec_Score") { return "Economy"; }
                else if (d== "Dem_Score") { return "Demographic"; } 
                else if (d == "Res_Score") { return "Resiliency"; }
                else if (d == "Res_Rank") { return "Rank"; }
                else { return d; }
            });

        // Add and store a brush for each axis
        dimension.append("g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
          .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        // Returns the path for a given data point.
        function path(d) {
          return line(dimensions.map(function(dimension) { return [x(dimension), y[dimension](d[dimension])]; }));
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
          var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
              extents = actives.map(function(p) { return y[p].brush.extent(); });

          foreground.style("display", function(d) {
              return actives.every(function(p, i)
              {
                  if (p == "Neighborhood") { return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
                  } else { return extents[i][0] <= d[p] && d[p] <= extents[i][1]; }
              }) ? null : "none";
          });
        }
    })

}



map_chart();

bubble_chart();

bar_chart();

parallel_chart();

