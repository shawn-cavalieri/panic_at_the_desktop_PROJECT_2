var svgWidth = 1100;
var svgHeight = 550;

var margin = {
  top: 40,
  right: 20,
  bottom: 90,
  left: 30
};

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#stock")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

function makeLine(xScale, yScale, chosenXAxis) {
    return d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d[chosenXAxis]));
}
function addLine(data, line, color) {
    return chartGroup.append("path")
        .data([data])
        .attr("d", line)
        .classed(color, true);
}
d3.csv('/assets/data/stocks.csv').then(function(data) {
    data.forEach(function(d) {
        d.Date = new Date(d.Date);
        Object.keys(d).forEach(function(key) {
            d[key] = +d[key];
        });
    });

    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Royal_Cruise_Percent) - 5, d3.max(data, d => d.Zoom_Percent)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%b-%d"));

    var leftAxis = d3.axisLeft(yLinearScale);

    function make_x_gridlines() {		
        return d3.axisBottom(xTimeScale)
            .ticks(10)
    }
    
    // gridlines in y axis function
    function make_y_gridlines() {		
        return d3.axisLeft(yLinearScale)
            .ticks(10)
    }
    chartGroup.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        );
  
    // add the Y gridlines
    chartGroup.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        );
    
    chartGroup.append("g").attr("transform",`translate(0, ${height})`).call(bottomAxis);
    // add y-axis (left)
    chartGroup.append("g").call(leftAxis);
    var centerLine = addLine(data, makeLine(xTimeScale, yLinearScale, 'Center'), 'line white');

    var zoomLine = addLine(data, makeLine(xTimeScale, yLinearScale, 'Zoom_Percent'), 'line green');

    var gspcLine = addLine(data, makeLine(xTimeScale, yLinearScale, 'GSPC_Percent'), 'line orange');

    var RCruiseLine = addLine(data, makeLine(xTimeScale, yLinearScale, 'Royal_Cruise_Percent'), 'line blue');

});
