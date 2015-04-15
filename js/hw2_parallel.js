var m = {top: 20, right: 20, bottom: 20, left: 40},
    w = 960 - m.right,
    h = 600 - m.top - m.bottom;

var x3 = d3.scale.ordinal().rangePoints([0, w], 1),
    y3 = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var colorScale = d3.scale.ordinal()
        .range(colorbrewer.Set1[4]);

var svg3 = d3.select("#chart-C").append("svg")
    .attr("width", w + m.right + m.left)
    .attr("height", h + m.top + m.bottom)
  .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");

d3.csv("statex77_parallel.csv", function(states) {

  color_div = {}
  for  (var i = 0; i < states.length; i++)
  {
      color_div[states[i].Region] = colorScale(states[i].Region);
  };

  x3.domain(dimensions = d3.keys(states[0]).filter(function(d) {
      if(d == "State") return false;
      if(d == "Region") {
          y3[d] = d3.scale.ordinal()
            .domain(states.map(function(p) { return p[d]; }))
            .rangePoints([h, 0]);
      }
      else {
          y3[d] = d3.scale.linear()
            .domain(d3.extent(states, function(p) { return +p[d]; }))
            .range([h, 0]);
      }
      return true;
  }));

  // Add grey background lines for context.
  background = svg3.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(states)
    .enter().append("path")
      .attr("d", path);

  // Add foreground lines for focus.
  foreground = svg3.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(states)
    .enter().append("path")
      .attr("d", path)
      .style("stroke", function(d) { return color_div[d.Region]; });

  // Add a group element for each dimension.
  var g = svg3.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x3(d) + ")"; })
      .call(d3.behavior.drag()
        .on("dragstart", function(d) {
          dragging[d] = this.__origin__ = x3(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
          foreground.attr("d", path).style("stroke", function(d) { return color_div[d.Region]; });
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x3.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete this.__origin__;
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x3(d) + ")");
          transition(foreground)
              .attr("d", path);
              // .style("stroke", function(d) { return color_div[d.Region]; });
          background
              .attr("d", path)
              .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y3[d])); })
    .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y3[d].brush = d3.svg.brush().y(y3[d]).on("brushstart", brushstart).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
});

function position(d) {
  var v = dragging[d];
  return v == null ? x3(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y3[p](d[p])]; }));
}

// When brushing, don’t trigger axis dragging.
function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y3[p].brush.empty(); }),
      extents = actives.map(function(p) { return y3[p].brush.extent(); });
  foreground.style("display", function(d) {
        return actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
      });
}
 