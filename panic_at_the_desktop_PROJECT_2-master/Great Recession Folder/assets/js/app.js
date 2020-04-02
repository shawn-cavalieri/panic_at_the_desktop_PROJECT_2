var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG wrapper and append an SVG group
var svg = d3.select("body")
    .append("svg")
    .classed("chart", true)
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate (${margin.left}, ${margin.top})`);

// Import Data 
d3.csv("assets/data/CombinedStock.csv").then(function(Circledata) {
//console.log(Circledata); --> to show that it reads data and it in fact does



    // Step 1: Parse Data/Cast as numbers
    // ===================================
    Circledata.forEach(function(data) {

        data.AdjClose = +data.AdjClose;
        data.AdjCloseAPX = +data.AdjCloseAPX;
        data.Date = data.Date;
    });


    // Finding xMin, xMax, yMin, and yMax to help plot the chart
    xMin = d3.min(Circledata, function(data) {
        return data.AdjClose;
    });

    console.log(xMin); //xMin is 30.5

    xMax = d3.max(Circledata, function(data) {
        return data.AdjCloseAPX;
    });

    console.log(xMax); //xMax is 44.1 

    yMin = d3.min(Circledata, function(data) {
        return data.AdjCloseAPX;
    });

    console.log(yMin); //yMin is 9.7

    yMax = d3.max(Circledata, function(data) {
        return data.AdjClose;
    });

    console.log(yMax); //yMax is 26.7

    // After finding max and min values, it helps us to plot
    // Step 2: Create scale functions
    // ===================================
    var xLinearScale = d3.scaleLinear()
    .domain([28, d3.max(Circledata, d => d.age)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([8, d3.max(Circledata, d => d.smokes)])
    .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Circledata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.AdjClose))
    .attr("cy", d => yLinearScale(d.AdjCloseAPX))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".6");
    
    
    chartGroup.select("g")
    .selectAll("circle")
    .data(Circledata)
    .enter()
    .append("text")
    .text(d => d.Date)
    .attr("x", d => xLinearScale(d.AdjClose))
    .attr("y", d => yLinearScale(d.AdjCloseAPX))
    .attr("dy",-395)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");


    // Step 6: Initialize tool tip
    // ===============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`$<hr><br>Age: ${d.AdjClose}<br>Smoke(%): ${d.AdjCloseAPX}`);
    });

  
    chartGroup.call(toolTip);

    // Creating mouseover
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Creating mouseout to hide tooltip
    circlesGroup.on("mouseout", function(d) {
        toolTip.hide(d);
    });


    // Step 7: Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)");

      
    chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Age (Median)");

}).catch(function(error) {
    console.log(error);
});
    
