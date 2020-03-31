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
function makeCirlces(data, xScale, yScale, chosenXAxis, color) {
    return chartGroup.selectAll()
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d[chosenXAxis]))
        .attr("r", 3)
        .attr("fill", color);
}
function makeLine(xScale, yScale, chosenXAxis) {
    return d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d[chosenXAxis]));
}
function addLine(data, line, color) {
    return chartGroup.append("path")
        .data([data])
        .attr("d", line)
        .classed(color, true);
}
function make_toolTip(circlesGroup, chosenYAxis) {

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosenYAxis === "unemp") {
                if (d.Year.getFullYear() === 2020) {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Expected Unemployment Rate: ${d.Unemployment_Rate}%`)
                }
                else {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Unemployment Rate: ${d.Unemployment_Rate}%`)
                }
                
            }
            else if (chosenYAxis === "gdp") {
                if (d.Year.getFullYear() === 2020) {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Expected GDP: ${d.GDP_Growth}%`)
                }
                else {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> GDP Growth: ${d.GDP_Growth}%`)
                }
                
            }
            else {
                if (d.Year.getFullYear() === 2020) {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Expected Inflation Rate: ${d.Inflation}%`)
                }
                else {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Inflation Rate: ${d.Inflation}%`)
                }
                
            }
        
    });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data, index, selection) {
    toolTip.show(data, selection[index])
})
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });
    return toolTip;
}

d3.json("/assets/data/Unemployment_Inflation.json").then(function(data, err) {
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
    chartGroup.append("g").attr("transform",`translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(bottomAxis);
    // add y-axis (left)
    chartGroup.append("g").call(leftAxis);

    var unemp_line = addLine(data, makeLine(xTimeScale, yLinearScale, 'Center'), "line white");

    var unemp_line = addLine(data, makeLine(xTimeScale, yLinearScale, 'Unemployment_Rate'), "line green");

    var gdp_line = addLine(data, makeLine(xTimeScale, yLinearScale, 'GDP_Growth'), "line orange");
        
    var inflation_line = addLine(data, makeLine(xTimeScale, yLinearScale, 'Inflation'), "line red");

    var unemp_circlesGroup = makeCirlces(data, xTimeScale, yLinearScale, 'Unemployment_Rate', "green");

    var unemp_tool = make_toolTip(unemp_circlesGroup, "unemp");

    var gdp_circlesGroup = makeCirlces(data, xTimeScale, yLinearScale, 'GDP_Growth', "orange");

    make_toolTip(gdp_circlesGroup, "gdp");

    var inflation_circlesGroup = makeCirlces(data, xTimeScale, yLinearScale, 'Inflation', "red");

    make_toolTip(inflation_circlesGroup, "inflation");

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
        .classed("inactive", true)
        .text("GDP Growth Per Year (%)");

    var inflationLabel = chartGroup.append("text")
        .attr("y", height + 70)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "red")
        .attr("value", "inflation")
        .classed("inactive", true)
        .text("Inflation Per Year (%)");

    var allLabel = chartGroup.append("text")
        .attr("y", height + 35)
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("value", "all")
        .text("All Data")
        .attr("fill", "white")
        .classed("active", true);

    var inflationVgdp = chartGroup.append("text")
        .attr("y", height + 90)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("value", "inflationVgdp")
        .attr("fill", "white")
        .classed("inactive", true)
        .text("Inflation vs GDP (%)");

    chartGroup.append("text")
        .attr("y", height - 430)
        .attr("x", width/2)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .text("Unemployment Rate  ( 1929 - 2019 )");
        
    chartGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value === "gdp") {
                activateLabel(gdpLabel);
                activateLine(gdp_line);
                activateLine(gdp_circlesGroup);
                deactivateLabel(inflationLabel);
                deactivateLine(inflation_line);
                deactivateLine(inflation_circlesGroup);
                deactivateLabel(unempLabel);
                deactivateLabel(inflationVgdp);
                deactivateLabel(allLabel);
                
            }
            else if (value === "inflation") {
                activateLabel(inflationLabel);
                activateLine(inflation_line);
                activateLine(inflation_circlesGroup);
                deactivateLine(gdp_line);
                deactivateLabel(gdpLabel);
                deactivateLabel(unempLabel);
                deactivateLabel(inflationVgdp);
                deactivateLine(gdp_circlesGroup);
                deactivateLabel(allLabel);
            }
            else if (value === "inflationVgdp") {
                activateLabel(inflationVgdp);
                activateLine(gdp_line);
                activateLine(inflation_line);
                activateLine(gdp_circlesGroup);
                activateLine(inflation_circlesGroup);
                deactivateLine(unemp_line);
                deactivateLabel(unempLabel);
                deactivateLine(unemp_circlesGroup);
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationLabel);
                deactivateLabel(allLabel);
                unemp_tool.hide();
            }
            else if (value === "unemp") {
                deactivateLabel(inflationLabel);
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationVgdp);
                activateLabel(unempLabel);
                activateLine(unemp_line);
                activateLine(unemp_circlesGroup);
                deactivateLine(inflation_line);
                deactivateLine(inflation_circlesGroup);
                deactivateLine(gdp_line);
                deactivateLine(gdp_circlesGroup);
                deactivateLabel(allLabel);
            }
            else {
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationLabel);
                deactivateLabel(unempLabel);
                activateLine(unemp_line);
                activateLine(unemp_circlesGroup);
                activateLine(gdp_line);
                deactivateLabel(inflationVgdp);
                activateLine(inflation_circlesGroup);
                activateLine(inflation_line);
                activateLine(gdp_circlesGroup);
                activateLabel(allLabel);
            }
        })
    }).catch(function(error) {
      console.log(error);
});