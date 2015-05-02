var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1150 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var bar = d3.select("#chart").append("svg")
    .attr("id", "bar_chart")
    .attr("width", (1/3)*width)
    .attr("height", height);

var scatter = d3.select("#chart").append("svg")
    .attr("id", "scatter_chart")
    .attr("width", (2/3)*width)
    .attr("height", (2/5)*height);

var area = d3.select("#chart").append("svg")
    .attr("id", "area_chart")
    .attr("width", (2/3)*width)
    .attr("height", (3/5)*height);

var color = d3.scale.ordinal().range(["#8dd3c7", "#bebada", "#80b1d3", "#fb8072", 
                                      "#fdb462", "#bc80bd", "#ffed6f"]);

var genres = ["Action", "Comedy", "Drama", "Documentary", "Romance"];

color.domain(genres);

function area_chart(){

    var m = {top: 0, right: 0, bottom: 20, left: 20},
        w = 700 - m.left - m.right,
        h = 80 - m.top - m.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
        .range([0, w]);

    var y = d3.scale.linear()
        .range([h, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.year); })
        .y0(h)
        .y1(function(d) { return y(d.value); });

    var line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });

    d3.csv("../data/movies_time_series.csv", type, function(error, data) {

      var movies = d3.nest()
          .key(function(d) { return d.variable; })
          .entries(data);

      x.domain([
        d3.min(movies, function(s) { return s.values[0].year; }),
        d3.max(movies, function(s) { return s.values[s.values.length - 1].year; })
      ]);

      var svg = d3.select("#area_chart").selectAll("g")
          .data(movies)
        .enter().append("g")
          .attr("transform", function(d, i){
            return "translate(" + m.left + "," + (i*70 + m.top) + ")";});

      svg.append("path")
          .attr("class", "area")
          .attr("id", "hide")
          .attr("d", function(d) { y.domain([0, 200]); return area(d.values); })
          .style("fill", function(d) { return color(d.key); })
          .transition().delay(800).duration(800);

      svg.append("text")
          .attr("x", 0)
          .attr("y", h - 10)
          .attr("id", "hide")
          .style("text-anchor", "start")
          .text(function(d) { return d.key; })
          .transition().delay(800).duration(800);

      svg.append("g")
          .attr("class", "x axis")
          .attr("id", "hide")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis)
          .transition().delay(800).duration(800);

    });

    function type(d) {
      d.value = +d.value;
      d.year = parseDate(d.year);
      return d;
    }
}

function bar_chart(){
    var m = {top: 20, right: 20, bottom: 60, left: 60},
        w = 400 - m.left - m.right,
        h = 645 - m.top - m.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, w], .1);
    var y = d3.scale.linear().range([h, 0]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var svg = d3.select("#bar_chart").append("g")
                .attr("transform", "translate(" + m.left + "," + m.top + ")");

    d3.csv("../data/movies_data.csv", function(error, data) {

        var bar_values = {Action: 0, Comedy: 0, Documentary: 0,
                          Drama: 0, Romance: 0};

        for (var i = 0; i < data.length; i++){
            bar_values.Action += +data[i].Action;
            bar_values.Comedy += +data[i].Comedy;
            bar_values.Documentary += +data[i].Documentary;
            bar_values.Drama += +data[i].Drama;
            bar_values.Romance += +data[i].Romance;
        };

        x.domain(Object.keys(bar_values));
        y.domain([0, 22000]);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
         .append("text")
            .attr("y", 5)
            .attr("dy", "-1.5em")
            .attr("x", 15)
            .style("text-anchor", "end")
            .text("Frequency");

        var bar = svg.append("g")
              .attr("class", "bars")
            .selectAll(".bar")
              .data(d3.entries(bar_values))
            .enter().append("rect")
              .attr("class", "bar")
              .attr("id", function(d){ return d.key; })
              .attr("x", function(d) { return x(d.key); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return h - y(d.value); })
              .style("fill", function(d) { return color(d.key); });

        bar.on("click", function(d){
            var id = d3.select(this).attr("id");
            var index = genres.indexOf(id);
            var new_genres = genres.slice(0);
            new_genres.splice(index, 1);
            var opacity = d3.select("rect#" + new_genres[0]).style("opacity");
            
            if (opacity == 1){
                d3.selectAll("path#hide").transition().duration(800)
                      .style("opacity", 0);
                d3.selectAll("text#hide").transition().duration(800)
                      .style("opacity", 0);
                d3.selectAll("g#hide").transition().duration(800)
                      .style("opacity", 0);
                
                for (var i = 0; i < new_genres.length; i++){
                    d3.selectAll("circle#" + new_genres[i]).transition().duration(800)
                      .style("opacity", 0);
                    d3.selectAll("rect#" + new_genres[i]).transition().duration(800)
                      .style("opacity", 0);
                    }
                draw_area_chart(id);
            }
            else {
                  d3.selectAll("circle").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("path#hide").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("text#hide").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("g#hide").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("rect").transition().delay(800).duration(800)
                        .style("opacity", 1);

                  d3.selectAll("path#show").transition().duration(800)
                        .style("opacity", 0);
                  d3.selectAll("g#show").transition().duration(800)
                        .style("opacity", 0);
                  }

            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

      });
}

function scatter_chart(){

    var m = {top: 20, right: 0, bottom: 80, left: 30},
        w = 700 - m.left - m.right,
        h = 300 - m.top - m.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.scale.linear().range([0, w]);
    var y = d3.scale.linear().range([h, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var svg = d3.select("#scatter_chart").append("g")
                .attr("transform", "translate(" + m.left + "," + m.top + ")");

    d3.csv("../data/low_budget_movies.csv", type, function(error, data) {

      y.domain([60, 160]);
      x.domain([2, 9]);

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
          .text("Rating");

      svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "start")
          .attr("y", -10)
          .attr("x", 0)
          .text("Length (minutes)");

      svg.append("text")
          .attr("text-anchor", "middle")
          .attr("x", w/2)
          .attr("y", -10)
          .text("Low Budget Movies (Under $3 million): Rating by Length")
          .style("font-size","14px");

      var dot = svg.append("g")
            .attr("class", "dots")
          .selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("id", function(d){ return d.genre; })
            .call(position);

    dot.on("click", function(d){
            var id = d3.select(this).attr("id");
            var index = genres.indexOf(id);
            var new_genres = genres.slice(0);
            new_genres.splice(index, 1);
            var opacity = d3.select("rect#" + new_genres[0]).style("opacity");
            
            if (opacity == 1){
                d3.selectAll("circle#" + id).transition().duration(800)
                      .style("opacity", 1);
                d3.selectAll("rect#" + id).transition().duration(800)
                      .style("opacity", 1);

                d3.selectAll("path#hide").transition().duration(800)
                      .style("opacity", 0);
                d3.selectAll("text#hide").transition().duration(800)
                      .style("opacity", 0);
                d3.selectAll("g#hide").transition().duration(800)
                      .style("opacity", 0);
                
                for (var i = 0; i < new_genres.length; i++){
                    d3.selectAll("circle#" + new_genres[i]).transition().duration(800)
                      .style("opacity", 0);
                    d3.selectAll("rect#" + new_genres[i]).transition().duration(800)
                      .style("opacity", 0);
                    }

                draw_area_chart(id);
            }
            else {
                  d3.selectAll("circle").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("path#hide").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("text#hide").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("g#hide").transition().delay(800).duration(800)
                        .style("opacity", 1);
                  d3.selectAll("rect").transition().delay(800).duration(800)
                        .style("opacity", 1);

                  d3.selectAll("path#show").transition().delay(800).duration(800)
                        .style("opacity", 0);
                  d3.selectAll("g#show").transition().delay(800).duration(800)
                        .style("opacity", 0);
                  }

            });

      function position(dot) {
        dot .attr("cy", function(d) { return y(d.length); })
            .attr("cx", function(d) { return x(+d.rating); })
            .attr("fill", function(d){ return color(d.genre)})
            .attr("opacity", 1)
            .attr("r", 4);
      }

    });
    
    function type(d) {
      d.year = parseDate(d.year);
      return d; 
    }

}

function draw_area_chart(id){

    var m = {top: 20, right: 0, bottom: 60, left: 40},
        w = 700 - m.left - m.right,
        h = 400 - m.top - m.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
        .range([0, w]);

    var y = d3.scale.linear()
        .range([h, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.year); })
        .y0(h)
        .y1(function(d) { return y(d.value); });

    var line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });

    d3.csv("../data/movies_time_series.csv", type, function(error, data) {

      var movies = d3.nest()
          .key(function(d) { return d.variable; })
          .entries(data);

      var index = genres.indexOf(id);

      x.domain([
        d3.min(movies, function(s) { return s.values[0].year; }),
        d3.max(movies, function(s) { return s.values[s.values.length - 1].year; })
      ]);

      var values = []
      for (j = 0; j < ((movies[index]).values).length; j ++){
          
          values.push(((movies[index]).values[j]).value)
      }

      y.domain([0, d3.max(values)]);

      var svg = d3.select("#area_chart").append("g")
            .attr("width", w + m.left + m.right)
            .attr("height", h + m.top + m.bottom)
            .attr("transform", "translate(" + m.left + "," + m.top + ")");

      svg.append("path")
          .datum(movies[index])
          .attr("class", "area")
          .attr("id", "show")
          .attr("d", function(d) { return area(d.values); })
          .style("fill", function(d) { return color(d.key); })
          .style("opacity", 0)
          .transition().delay(600).duration(400)
              .style("opacity", 1);

      svg.append("g")
          .attr("class", "x axis")
          .attr("id", "show")
          .attr("transform", "translate(0," + h + ")")
          .transition().delay(600).duration(400)
            .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .attr("id", "show")
          .transition().delay(600).duration(400)
            .call(yAxis);

    });

    function type(d) {
      d.value = +d.value;
      d.year = parseDate(d.year);
      return d;
    }
}

area_chart();

bar_chart();

scatter_chart();
