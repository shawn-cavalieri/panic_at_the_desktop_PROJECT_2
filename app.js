var svgWidth = 970;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 90,
  left: 100
};

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

function deactivateLine(line) {
    return line
        .classed("deactivate", true)
        .classed("activate", false);
}
function activateLine(line) {
    return line
        .classed("activate", true)
        .classed("deactivate", false);
}
function activateLabel(label) {
    return label
      .classed("active", true)
      .classed("inactive", false);
  }
function deactivateLabel(label) {
    return label
        .classed("active", false)
        .classed("inactive", true);
  }
d3.json("Unemployment_Inflation.json").then(function(data, err) {
    if (err) throw err;
    // parse data
    data.forEach(function(d) {
      d.Unemployment_Rate = +d.Unemployment_Rate;
      d.GDP_Growth = +d.GDP_Growth;
      d.Inflation = +d.Inflation;
      d.Year = parseTime(d.Year);
    });
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.GDP_Growth), d3.max(data, d => d.Unemployment_Rate)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));

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
    chartGroup.append("g").attr("transform",`translate(${width - 830}, ${height})`).call(bottomAxis);
    // add y-axis (left)
    chartGroup.append("g").call(leftAxis);

    var line1 = d3.line()
        .x(d => xTimeScale(d.Year))
        .y(d => yLinearScale(d.Unemployment_Rate));
    var line2 = d3.line()
        .x(d => xTimeScale(d.Year))
        .y(d => yLinearScale(d.GDP_Growth));
    var line3 = d3.line()
        .x(d => xTimeScale(d.Year))
        .y(d => yLinearScale(d.Inflation));

    var unemp_line = chartGroup.append("path")
        .data([data])
        .attr("d", line1)
        .classed("line green", true);
    
      // Append a path for line2
    var gdp_line = chartGroup.append("path")
        .data([data])
        .attr("d", line2)
        .classed("line orange", true);
    var inflation_line = chartGroup.append("path")
        .data([data])
        .attr("d", line3)
        .classed("line red", true);
        
    chartGroup.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )
  
    // add the Y gridlines
    chartGroup.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

    var unempLabel = chartGroup.append("text")
        .attr("y", height + 30)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "green")
        .attr("value", "unemp")
        .classed("inactive", true)
        .text("Unemployment Rate in the US (%)");

    var gdpLabel = chartGroup.append("text")
        .attr("y", height + 50)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "orange")
        .attr("value", "gdp")
        .text("GDP Growth Per Year (%)");

    var inflationLabel = chartGroup.append("text")
        .attr("y", height + 70)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "red")
        .attr("value", "inflation")
        .text("Inflation Per Year (%)");

    var inflationVgdp = chartGroup.append("text")
        .attr("y", height + 90)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "blue")
        .attr("value", "inflationVgdp")
        .text("Inflation vs GDP (%)");
    
    chartGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value === "gdp") {
                activateLabel(gdpLabel);
                activateLine(gdp_line);
                deactivateLabel(inflationLabel);
                deactivateLine(inflation_line);
                deactivateLabel(unempLabel);
                deactivateLabel(inflationVgdp);
            }
            else if (value === "inflation") {
                activateLabel(inflationLabel);
                activateLine(inflation_line);
                deactivateLine(gdp_line);
                deactivateLabel(gdpLabel);
                deactivateLabel(unempLabel);
                deactivateLabel(inflationVgdp);
            }
            else if (value === "inflationVgdp") {
                activateLabel(inflationVgdp);
                activateLine(gdp_line);
                activateLine(inflation_line);
                deactivateLine(unemp_line);
                deactivateLabel(unempLabel);
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationLabel);
            }
            else {
                deactivateLine(inflation_line);
                deactivateLine(gdp_line);
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationLabel);
                activateLabel(unempLabel);
                activateLine(unemp_line);
                deactivateLabel(inflationVgdp);
            }
        })
    }).catch(function(error) {
      console.log(error);
});