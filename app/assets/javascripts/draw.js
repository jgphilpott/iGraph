// Calling a series of functions that will draw the graph, data points and user controls.
function drawAll() {
  drawGraph();
  drawCircles();
  drawTimeControls();
  drawMenu();
};

// A function that defines how to draw the graph.
function drawGraph() {

  var xGridTickFrequency = (graphWidth)/160;
  var yGridTickFrequency = (graphHeight)/100;
  var xAxisTickFrequency = (graphWidth)/80;
  var yAxisTickFrequency = (graphHeight)/50;

  // Appending the X Gridlines.
  graphZone.append("g")
           .attr("class", "grid")
           .attr("transform", "translate(" + leftMargin + ", " + (graphZoneHeight - bottomMargin) + ")")
           .call(d3.axisBottom(xScale)
                   .tickSize( -(graphZoneHeight - topMargin - bottomMargin) )
                   .tickFormat("")
                   .ticks(xGridTickFrequency));

  // Appending the Y Gridlines.
  graphZone.append("g")
           .attr("class", "grid")
           .attr("transform", "translate(" + leftMargin + ", " + topMargin + ")")
           .call(d3.axisLeft(yScale)
                   .tickSize( -(graphZoneWidth - leftMargin - rightMargin) )
                   .tickFormat("")
                   .ticks(yGridTickFrequency));

  // Appending the X Axis.
  graphZone.append("g")
           .attr("class", "axis")
           .attr("id", "xAxis")
           .attr("transform", "translate(" + leftMargin + ", " + (graphZoneHeight - bottomMargin) + ")")
           .call(d3.axisBottom(xScale)
                   .ticks(xAxisTickFrequency));

  // Appending the Y Axis.
  graphZone.append("g")
           .attr("class", "axis")
           .attr("id", "yAxis")
           .attr("transform", "translate(" + leftMargin + ", " + topMargin + ")")
           .call(d3.axisLeft(yScale)
                   .ticks(yAxisTickFrequency));

  $(".grid").mouseover(function() {
    if (animatingGraph === true) {
      $(this).css('cursor', 'wait');
    } else {
      $(this).css('cursor', 'default');
    };
  });

  // Calling the 'Draw Graph Labels' function.
  drawGraphLabels();

};// End of 'Draw Graph' function.

// A function that defines how to draw the graph labels.
function drawGraphLabels() {

  var xAxisHeight = $("#xAxis")[0].getBBox().height;
  var yAxisWidth = $("#yAxis")[0].getBBox().width;
  var textSize = 20;

  // Appending the 'Graph Title'.
  graphZone.append("text")
           .attr("class", "graph-title")
           .attr("x", (leftMargin + graphWidth/2))
           .attr("y",  "1em")
           .attr("dy", ".35em")
           .text("World Development Indicators");

  // Appending the graph 'Date Range' label.
  graphZone.append("text")
           .attr("class", "date-range")
           .attr("x", (leftMargin + graphWidth/2))
           .attr("y",  "2.5em")
           .attr("dy", ".35em")
           .text(firstYear + " - " + lastYear);

  // Appending X Axis Label.
  graphZone.append("text")
           .attr("class", "axis-label")
           .attr("id", "x-axis-label")
           .attr("x", (leftMargin + graphWidth/2))
           .attr("y",  (graphZoneHeight - (bottomMargin - xAxisHeight)/2))
           .attr("dy", ".35em")
           .attr("font-size", textSize)
           .text(xAxisLabel);

  // Appending Y Axis Label.
  graphZone.append("text")
           .attr("class", "axis-label")
           .attr("id", "y-axis-label")
           .attr("transform", "rotate(-90)")
           .attr("x", -(topMargin + graphHeight/2))
           .attr("y",  (leftMargin - yAxisWidth)/2)
           .attr("dy", ".35em")
           .attr("font-size", textSize)
           .text(yAxisLabel);

  var xAxisLabelWidth = $("#x-axis-label")[0].getBBox().width;
  var yAxisLabelWidth = $("#y-axis-label")[0].getBBox().width;

  if (xAxisLabelWidth > graphWidth) {
    while (xAxisLabelWidth > graphWidth) {

      $("#x-axis-label").remove();

      textSize = textSize - 1;

      // Appending the new X Axis Label.
      graphZone.append("text")
               .attr("class", "axis-label")
               .attr("id", "x-axis-label")
               .attr("x", (leftMargin + graphWidth/2))
               .attr("y",  (graphZoneHeight - (bottomMargin - xAxisHeight)/2))
               .attr("dy", ".35em")
               .attr("font-size", textSize)
               .text(xAxisLabel);

      var xAxisLabelWidth = $("#x-axis-label")[0].getBBox().width;

    };
    textSize = 20;
  };

  if (yAxisLabelWidth > graphHeight) {
    while (yAxisLabelWidth > graphHeight) {

      $("#y-axis-label").remove();

      textSize = textSize - 1;

      // Appending the new Y Axis Label.
      graphZone.append("text")
               .attr("class", "axis-label")
               .attr("id", "y-axis-label")
               .attr("transform", "rotate(-90)")
               .attr("x", -(topMargin + graphHeight/2))
               .attr("y",  (leftMargin - yAxisWidth)/2)
               .attr("dy", ".35em")
               .attr("font-size", textSize)
               .text(yAxisLabel);

      var yAxisLabelWidth = $("#y-axis-label")[0].getBBox().width;

    };
    textSize = 20;
  };


  // Changing the cursor type for the Y axis.
  $("#y-axis-label").mouseover(function() {
    $(this).css('cursor', 'vertical-text');
  });

  // Calling the 'Draw Current Year Label' function.
  drawCurrentYearLabel();

};// End of 'Draw Graph Labels' function.

// A function that defines how to draw the current year label.
function drawCurrentYearLabel() {

    // Appending 'Current Year Label'.
    graphZone.append("text")
             .attr("class", "current-year-label")
             .attr("x", currentYearScale(currentYear) + leftMargin + 13)
             .attr("y",  "70")
             .attr("dy", ".35em")
             .text(currentYear);

};// End of 'Draw Current Year Label' function.

// A function that defines how to draw the circles.
function drawCircles() {

  // Creating the 'Circle Data' array to store the result of the following operations.
  var circleData = [];

  // Appending a new SVG so that if a circles body extends over the graph area it will be cutoff, rather than obstructing the view.
  graphArea = graphZone.append("svg")
                       .attr("class", "graph-area")
                       .attr("width", graphWidth)
                       .attr("height", graphHeight)
                       .attr("x", leftMargin)
                       .attr("y", topMargin);

  // Looping over the 'Scaled Graph Data'.
  for (var i = 0; i < scaledGraphData.length; i++) {

    // Looping over each index of the 'Scaled Graph Data'.
    for (var j = 0; j < scaledGraphData[i].length; j++) {

      // Checking if the year of the current 'Country Object' matches the 'Current Year' variable.
      if (scaledGraphData[i][j]["Year"] === currentYear) {

        // Pushing the current 'Country Object' into the 'Circle Data' array.
        circleData.push(scaledGraphData[i][j]);

      };// End of matching year check.
    };// End of 'Scaled Graph Data' index loop.
  };// End of 'Scaled Graph Data' loop.

  // Sorting the 'Circle Data' by radius so that the larger circles get apended first.
  circleData.sort(function(a, b) {
    return b.R - a.R;
  });

  // Looping over the 'Circle Data' array.
  for (var i = 0; i < circleData.length; i++) {

    for (var j = 0; j < graphData.length; j++) {
      if (circleData[i].Code === graphData[j][0].Code) {
        for (var k = 0; k < graphData[j].length; k++) {
          if (circleData[i].Year === graphData[j][k].Year) {
            var countryObject = graphData[j][k];
            break;
          };
        };
        break;
      };
    };

    if ((drawRegionsExceptionList.includes(circleData[i].Region.replace(/&/g, "and").replace(/ /g, "-").toLowerCase()) !== true) && (drawCountriesExceptionList.includes(circleData[i].Name.replace(/[.,\/#!$%\^&\*;:{}=\-_`'’~()]/g, "").replace(/\s/g, "-").toLowerCase()) !== true)) {

      // Appending the 'Country Object' as a circle onto the graph.
      graphArea.append("circle")
               .data([countryObject])
               .attr("class", "" + circleData[i].Name.replace(/[.,\/#!$%\^&\*;:{}=\-_`'’~()]/g, "").replace(/\s/g, "-").toLowerCase() + " " + circleData[i].Region.replace(/&/g, "and").replace(/ /g, "-").toLowerCase() + " country-circle")
               .attr("id", circleData[i].Code)
               .attr("cx", circleData[i].X)
               .attr("cy", circleData[i].Y)
               .attr("r", circleData[i].R)
               .attr("fill", circleData[i].Colour);

    };

  };// End of 'Circle Data' loop.

  // Adding an event handler to change style properties of a 'Country Circle' while the mouse is hovering over it.
  $(".country-circle").mouseover(function(event) {

    if (animatingGraph !== true) {

      $(this).css('cursor', 'pointer');
      $(this).css('stroke-width', 2.5);

      var countryObject = d3.select(this).datum();
      var padding = 5;

      graphZone.append("text")
               .attr("class", "country-circle-name-temp")
               .text(countryObject.Name);

      graphZone.append("text")
               .attr("class", "country-circle-x-temp")
               .text(Math.round(countryObject.X * 100)/100);

      graphZone.append("text")
               .attr("class", "country-circle-y-temp")
               .text(Math.round(countryObject.Y * 100)/100);

      var nameWidth = $(".country-circle-name-temp")[0].getBBox().width;
      var nameHeight = $(".country-circle-name-temp")[0].getBBox().height;
      var xWidth = $(".country-circle-x-temp")[0].getBBox().width;
      var xHeight = $(".country-circle-x-temp")[0].getBBox().height;
      var yWidth = $(".country-circle-y-temp")[0].getBBox().width;
      var yHeight = $(".country-circle-y-temp")[0].getBBox().height;

      $(".country-circle-name-temp").remove();
      $(".country-circle-x-temp").remove();
      $(".country-circle-y-temp").remove();

      graphZone.append("rect")
               .attr("class", "country-circle-name-label tooltip-one")
               .attr("width", nameWidth + (padding * 2))
               .attr("height", nameHeight + (padding * 2))
               .attr("x", this.cx.animVal.value - (nameWidth + (padding * 2))/2 + leftMargin)
               .attr("y", function() {
                 if ((topMargin + event.target.cy.animVal.value - event.target.r.animVal.value - padding - (nameHeight + (padding * 2))) < topMargin) {
                   return topMargin + event.target.cy.animVal.value + event.target.r.animVal.value + padding + 2.5;
                 } else {
                   return event.target.cy.animVal.value - event.target.r.animVal.value - nameHeight - (padding * 3) - 2.5 + topMargin;
                 };
               })
               .attr("rx", 10)
               .attr("ry", 10)
               .attr("stroke", countryObject.Colour)
               .attr("stroke-width", 2)
               .attr("fill", "white");

      graphZone.append("rect")
               .attr("class", "country-circle-x-label tooltip-one")
               .attr("width", xWidth + (padding * 2))
               .attr("height", xHeight + (padding * 2))
               .attr("x", leftMargin + this.cx.animVal.value - (xWidth + (padding * 2))/2)
               .attr("y", function() {
                 if ((topMargin + event.target.cy.animVal.value + event.target.r.animVal.value) > (graphZoneHeight - bottomMargin - xHeight - (padding * 4))) {
                   return topMargin + padding;
                 } else {
                   return graphZoneHeight - bottomMargin - padding - (xHeight + (padding * 2));
                 };
               })
               .attr("rx", 10)
               .attr("ry", 10)
               .attr("stroke", countryObject.Colour)
               .attr("stroke-width", 2)
               .attr("fill", "white");

      graphZone.append("rect")
               .attr("class", "country-circle-y-label tooltip-one")
               .attr("width", yWidth + (padding * 2))
               .attr("height", yHeight + (padding * 2))
               .attr("x", function() {
                 if ((leftMargin + event.target.cx.animVal.value - event.target.r.animVal.value) < (leftMargin + (yWidth + (padding * 2)) + padding)) {
                   return graphZoneWidth - rightMargin - padding - (yWidth + (padding * 2));
                 } else {
                   return leftMargin + padding;
                 };
               })
               .attr("y", topMargin + this.cy.animVal.value - (yHeight + (padding * 2))/2)
               .attr("rx", 10)
               .attr("ry", 10)
               .attr("stroke", countryObject.Colour)
               .attr("stroke-width", 2)
               .attr("fill", "white");

      graphZone.append("text")
               .attr("class", "country-circle-name tooltip-one")
               .attr("x", this.cx.animVal.value + leftMargin)
               .attr("y", function() {
                 if ((topMargin + event.target.cy.animVal.value - event.target.r.animVal.value - padding - (nameHeight + (padding * 2))) < topMargin) {
                   return topMargin + event.target.cy.animVal.value + event.target.r.animVal.value + padding + 2.5 + (nameHeight + (padding * 2))/2;
                 } else {
                   return event.target.cy.animVal.value - event.target.r.animVal.value - padding - 2.5 - (nameHeight + (padding * 2))/2 + topMargin;
                 };
               })
               .attr("dy", ".35em")
               .text(countryObject.Name);

      graphZone.append("text")
               .attr("class", "country-circle-x tooltip-one")
               .attr("x", leftMargin + this.cx.animVal.value)
               .attr("y", function() {
                 if ((topMargin + event.target.cy.animVal.value + event.target.r.animVal.value) > (graphZoneHeight - bottomMargin - xHeight - (padding * 4))) {
                   return topMargin + padding + (xHeight + (padding * 2))/2;
                 } else {
                   return graphZoneHeight - bottomMargin - padding - (xHeight + (padding * 2))/2;
                 };
               })
               .attr("dy", ".35em")
               .text(Math.round(countryObject.X * 100)/100);

      graphZone.append("text")
               .attr("class", "country-circle-y tooltip-one")
               .attr("x", function() {
                 if ((leftMargin + event.target.cx.animVal.value - event.target.r.animVal.value) < (leftMargin + (yWidth + (padding * 2)) + padding)) {
                   return graphZoneWidth - rightMargin - padding - (yWidth + (padding * 2))/2;
                 } else {
                   return leftMargin + padding + (yWidth + (padding * 2))/2;
                 };
               })
               .attr("y", topMargin + this.cy.animVal.value)
               .attr("dy", ".35em")
               .text(Math.round(countryObject.Y * 100)/100);

    } else {

      $(this).css('cursor', 'not-allowed');

    };

  }).mouseout(function(event) {

    $(this).css('stroke-width', 1.25);
    $(".country-circle-name-label").remove();
    $(".country-circle-name").remove();
    $(".country-circle-x-label").remove();
    $(".country-circle-x").remove();
    $(".country-circle-y-label").remove();
    $(".country-circle-y").remove();

  });

};// End of 'Draw Circles' function.

// A function that defines how to draw the time controls.
function drawTimeControls() {

  // Turning graph animation off by default.
  animatingGraph = false;

  // Setting the default 'Speed' and 'Speed Modifier' variables.
  speed = 500;
  currentSpeed = 500;
  forwardSpeedModifier = 1;
  backwardSpeedModifier = 1;

  // Setting the direction variables.
  forward = "FORWARD";
  backward = "BACKWARD";

  // Appending a new SVG to simplify the positioning of child elements.
  var timeControls = graphZone.append("svg")
                              .attr("class", "time-controls")
                              .attr("width", graphWidth)
                              .attr("height", 34)
                              .attr("x", leftMargin)
                              .attr("y", 75);

  // Calling the 'Draw Time Buttons' function.
  drawTimeButtons ();

  // Calling the draw 'Time Controllers' function.
  drawTimeControllers();

  // A function to define how to draw the 'Time Buttons'.
  function drawTimeButtons () {

    // Calling the 'Draw Forward Time Buttons' function.
    drawForwardTimeButtons();

    // Calling the 'Draw Backward Time Buttons' function.
    drawBackwardTimeButtons();

    // Calling the 'Add Event Handlers' function.
    addEventHandlers();

    // A function to define how to draw the 'Forward Time Buttons'.
    function drawForwardTimeButtons() {

      // Appending the skip backward button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "skip-backward-background")
                  .attr("cx", 26)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the skip backward button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "skip-backward")
                  .attr("transform", "translate(10, 1)")
                  .attr("d", "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13 M14 16l8-6v12 M10 10h4v12h-4v-12z");

      // Appending the play forward button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "play-forward-background")
                  .attr("cx", 69)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the play forward button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "play-forward")
                  .attr("transform", "translate(53, 1)")
                  .attr("d", "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z");

      // Appending the pause one button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "pause-one-background")
                  .attr("cx", 69)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the pause one button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "pause-one")
                  .attr("transform", "translate(53, 1)")
                  .attr("d", "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h4v12h-4zM18 10h4v12h-4z");

      // Appending the fast forward button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "fast-forward-background")
                  .attr("cx", 112)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the fast forward button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "fast-forward")
                  .attr("transform", "translate(96, 1)")
                  .attr("d", "M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13z");

      // Appending the fast forward button arrow one.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "fast-forward-arrow-one")
                  .attr("transform", "translate(96, 1)")
                  .attr("d", "M18 11l7 5-7 5z");

      // Appending the fast forward button arrow two.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "fast-forward-arrow-two")
                  .attr("transform", "translate(96, 1)")
                  .attr("d", "M10 11l7 5-7 5z");

    };// End of 'Draw Forward Time Buttons' function.

    // A function to define how to draw the 'Backward Time Buttons'.
    function drawBackwardTimeButtons() {

      // Appending the fast backward button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "fast-backward-background")
                  .attr("cx", graphWidth - 113)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the fast backward button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "fast-backward")
                  .attr("transform", "translate(" + (graphWidth - 129) + ", 1)")
                  .attr("d", "M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13z");

      // Appending the fast backward button arrow one.
      timeControls.append("path")
                .attr("class", "time-button")
                .attr("id", "fast-backward-arrow-one")
                .attr("transform", "translate(" + (graphWidth - 129) + ", 1)")
                .attr("d", "M14 21l-7-5 7-5z");

      // Appending the fast backward button arrow two.
      timeControls.append("path")
                .attr("class", "time-button")
                .attr("id", "fast-backward-arrow-two")
                .attr("transform", "translate(" + (graphWidth - 129) + ", 1)")
                .attr("d", "M22 21l-7-5 7-5z");

      // Appending the play backward button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "play-backward-background")
                  .attr("cx", graphWidth - 70)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the play backward button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "play-backward")
                  .attr("transform", "translate(" + (graphWidth - 86) + ", 1)")
                  .attr("d", "M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM20 23l-12-7 12-7z");

      // Appending the pause two button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "pause-two-background")
                  .attr("cx", graphWidth - 70)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the pause two button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "pause-two")
                  .attr("transform", "translate(" + (graphWidth - 86) + ", 1)")
                  .attr("d", "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h4v12h-4zM18 10h4v12h-4z");

      // Appending the skip forward button background.
      timeControls.append("circle")
                  .attr("class", "time-button")
                  .attr("id", "skip-forward-background")
                  .attr("cx", graphWidth - 27)
                  .attr("cy", 17)
                  .attr("r", 16);

      // Appending the skip forward button.
      timeControls.append("path")
                  .attr("class", "time-button")
                  .attr("id", "skip-forward")
                  .attr("transform", "translate(" + (graphWidth - 43) + ", 1)")
                  .attr("d", "M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16zM16 29c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13 M18 16l-8-6v12 M22 10h-4v12h4v-12z");

    };// End of 'Draw Backward Time Buttons' function.

    // A function for adding event handlers.
    function addEventHandlers() {

      // Adding an event handler to style the 'Time Buttons' on mouseover.
      $(".time-button").mouseover(function() {

        // Changing the cursor to a pointer.
        $(this).css('cursor', 'pointer');

        // Checking which button the mouse is currently hovering over using the element ID.
        if (this.id === "skip-backward" || this.id === "skip-backward-background") {

          // Changing the button background the lightgrey.
          $("#skip-backward-background").css("fill", "lightgrey");

          // All of the following code blocks follow the same pattern.

        } else if (this.id === "play-forward" || this.id === "play-forward-background") {
          $("#play-forward-background").css("fill", "lightgrey");
        } else if (this.id === "fast-forward" || this.id === "fast-forward-background" || this.id === "fast-forward-arrow-one" || this.id === "fast-forward-arrow-two") {
          $("#fast-forward-background").css("fill", "lightgrey");
        } else if (this.id === "fast-backward" || this.id === "fast-backward-background" || this.id === "fast-backward-arrow-one" || this.id === "fast-backward-arrow-two") {
          $("#fast-backward-background").css("fill", "lightgrey");
        } else if (this.id === "play-backward" || this.id === "play-backward-background") {
          $("#play-backward-background").css("fill", "lightgrey");
        } else if (this.id === "skip-forward" || this.id === "skip-forward-background") {
          $("#skip-forward-background").css("fill", "lightgrey");
        } else if (this.id === "pause-one" || this.id === "pause-one-background") {
          $("#pause-one-background").css("fill", "lightgrey");
        } else if (this.id === "pause-two" || this.id === "pause-two-background") {
          $("#pause-two-background").css("fill", "lightgrey");
        } else {

          // If an appropriate ID is not found log an error.
          console.log("Error in time button event handler!");

        };// End of 'Time Button' ID check.

      }).mouseout(function() {

        // Restoring the button background to white after the mouse leaves.
        $("#skip-backward-background, #play-forward-background, #pause-one-background, #fast-forward-background, #fast-backward-background, #play-backward-background, #pause-two-background, #skip-forward-background").css("fill", "white");

      });// End of 'Time Buttons' styleing event handler.

      // Adding an event handler for clicking the 'Skip Backward Time Button'.
      $("#skip-backward, #skip-backward-background").click(function() {

        // Stop the graph animation if one is in process.
        if (animatingGraph) {
          stopAnimatingGraph();
        };

        // Checking if the 'Current Year' is not already the 'First Year'.
        if (currentYear !== firstYear) {

          // Updating 'Current Year' variable.
          currentYear = firstYear;

          // Removing old elements.
          $(".year-control").remove();
          $(".time-line").remove();
          $(".current-year-label").remove();
          $(".graph-area").remove();

          // Redrawing elements.
          drawTimeControllers();
          drawCurrentYearLabel()
          drawCircles();

        };// End of year check;

      });// End of event handler for 'Skip Backward Time Button'.

      // Adding an event handler for clicking the 'Play Forward Time Button'.
      $("#play-forward, #play-forward-background").click(function() {

        // Stop the graph animation if one is in process.
        if (animatingGraph) {
          stopAnimatingGraph();
        };

        // Only trigger forward animation if the ‘Current Year’ is not already the ‘Last Year’.
        if (currentYear !== lastYear) {

          // Removing old elements.
          $(".graph-area").remove();
          $(".year-control").remove();
          $(".time-line").remove();
          $(".current-year-label").remove();

          // Toggling the play/pause buttons.
          $("#play-forward, #play-forward-background").css("visibility", "hidden");
          $("#pause-one, #pause-one-background").css("visibility", "visible");
          $("#play-backward, #play-backward-background").css("visibility", "visible");
          $("#pause-two, #pause-two-background").css("visibility", "hidden");

          // Redrawing elements.
          drawCircles();
          drawTimeControllers();
          drawCurrentYearLabel();

          // Calculating the animation speed.
          currentSpeed = speed/forwardSpeedModifier;

          // Calling the 'Animate Graph' function.
          animateGraph(forward, currentSpeed);

          //Setting the animation interval.
          animationInterval = setInterval(animateForward, currentSpeed);

        };// End of year check.

      });// End of 'Play Forward' event handler.

      // Adding an event handler for clicking the 'Pause One Time Button'.
      $("#pause-one, #pause-one-background").click(function() {

        // Stoping the graph animation.
        stopAnimatingGraph();

        // Removing old elements.
        $(".current-year-label").remove();
        $(".year-control").remove();
        $(".time-line").remove();
        $(".graph-area").remove();

        // Redrawing elements.
        drawCurrentYearLabel();
        drawTimeControllers()
        drawCircles();

        // Toggling the play/pause buttons.
        $("#play-forward, #play-forward-background").css("visibility", "visible");
        $("#pause-one, #pause-one-background").css("visibility", "hidden");

      });// End of 'Pause One' event handler.

      // Adding an event handler for clicking the 'Fast Forward Time Button'.
      $("#fast-forward, #fast-forward-background, #fast-forward-arrow-one, #fast-forward-arrow-two").click(function() {

        // Checking the current value of the 'Forward Speed Modifier' variable.
        if (forwardSpeedModifier === 1) {

          // Reassigning the 'Speed Modifier' variables.
          forwardSpeedModifier = 4/3;
          backwardSpeedModifier = 1;

          // Styling the arrows.
          $("#fast-forward-arrow-one").css({"stroke": "#3168C5", "fill": "#3168C5"});
          $("#fast-backward-arrow-one, #fast-backward-arrow-two").css({"stroke": "#009AC2", "fill": "#009AC2"});

          // Checking if an animation is already in process.
          if (animatingGraph) {

            // Stoping the current animation.
            stopAnimatingGraph();

            // Removing and redrawing the graph.
            $(".graph-area").remove();
            drawCircles();

            // Calculating the animation speed.
            currentSpeed = speed/forwardSpeedModifier;

            // Toggling the play/pause buttons.
            $("#play-forward, #play-forward-background").css("visibility", "hidden");
            $("#pause-one, #pause-one-background").css("visibility", "visible");

            // Calling the 'Animate Graph' function.
            animateGraph(forward, currentSpeed);

            //Setting the animation interval.
            animationInterval = setInterval(animateForward, currentSpeed);

          };// End of animation check.

          // The following code blocks follow the same pattern as above.

        } else if (forwardSpeedModifier === 4/3) {

          forwardSpeedModifier = 2;

          $("#fast-forward-arrow-two").css({"stroke": "#3168C5", "fill": "#3168C5"});

          if (animatingGraph) {

            stopAnimatingGraph();

            $(".graph-area").remove();
            drawCircles();

            currentSpeed = speed/forwardSpeedModifier;

            $("#play-forward, #play-forward-background").css("visibility", "hidden");
            $("#pause-one, #pause-one-background").css("visibility", "visible");

            animateGraph(forward, currentSpeed);

            animationInterval = setInterval(animateForward, currentSpeed);

          };

        } else if (forwardSpeedModifier === 2) {

          forwardSpeedModifier = 1;

          $("#fast-forward-arrow-one, #fast-forward-arrow-two").css({"stroke": "#009AC2", "fill": "#009AC2"});

          if (animatingGraph) {

            stopAnimatingGraph();

            $(".graph-area").remove();
            drawCircles();

            currentSpeed = speed/forwardSpeedModifier;

            $("#play-forward, #play-forward-background").css("visibility", "hidden");
            $("#pause-one, #pause-one-background").css("visibility", "visible");

            animateGraph(forward, currentSpeed);

            animationInterval = setInterval(animateForward, currentSpeed);

          };
        };// End of 'Forward Speed Modifier' variable check.
      });// End of 'Fast Forward' event handler.

      // Adding an event handler for clicking the 'Fast Backward Time Button'.
      // Follows the same pattern as the ‘Fast Forward’ button.
      $("#fast-backward, #fast-backward-background, #fast-backward-arrow-one, #fast-backward-arrow-two").click(function() {

        if (backwardSpeedModifier === 1) {

          backwardSpeedModifier = 4/3;
          forwardSpeedModifier = 1;

          $("#fast-backward-arrow-one").css({"stroke": "#3168C5", "fill": "#3168C5"});
          $("#fast-forward-arrow-one, #fast-forward-arrow-two").css({"stroke": "#009AC2", "fill": "#009AC2"});

          if (animatingGraph) {

            stopAnimatingGraph();

            $(".graph-area").remove();
            drawCircles();

            currentSpeed = speed/backwardSpeedModifier;

            $("#play-backward, #play-backward-background").css("visibility", "hidden");
            $("#pause-two, #pause-two-background").css("visibility", "visible");

            animateGraph(backward, currentSpeed);

            animationInterval = setInterval(animateBackward, currentSpeed);

          };

        } else if (backwardSpeedModifier === 4/3) {

          backwardSpeedModifier = 2;

          $("#fast-backward-arrow-two").css({"stroke": "#3168C5", "fill": "#3168C5"});

          if (animatingGraph) {

            stopAnimatingGraph();

            $(".graph-area").remove();
            drawCircles();

            currentSpeed = speed/backwardSpeedModifier;

            $("#play-backward, #play-backward-background").css("visibility", "hidden");
            $("#pause-two, #pause-two-background").css("visibility", "visible");

            animateGraph(backward, currentSpeed);

            animationInterval = setInterval(animateBackward, currentSpeed);

          };

        } else if (backwardSpeedModifier === 2) {

          backwardSpeedModifier = 1;

          $("#fast-backward-arrow-one, #fast-backward-arrow-two").css({"stroke": "#009AC2", "fill": "#009AC2"});

          if (animatingGraph) {

            stopAnimatingGraph();

            $(".graph-area").remove();
            drawCircles();

            currentSpeed = speed/backwardSpeedModifier;

            $("#play-backward, #play-backward-background").css("visibility", "hidden");
            $("#pause-two, #pause-two-background").css("visibility", "visible");

            animateGraph(backward, currentSpeed);

            animationInterval = setInterval(animateBackward, currentSpeed);

          };
        };
      });// End of 'Fast Backward' event handler.

      // Adding an event handler for clicking the 'Play Backward Time Button'.
      // Follows the same pattern as the ‘Play Forward’ button.
      $("#play-backward, #play-backward-background").click(function() {

        if (animatingGraph) {
          stopAnimatingGraph();
        };

        if (currentYear !== firstYear) {
          $(".graph-area").remove();
          $(".year-control").remove();
          $(".time-line").remove();
          $(".current-year-label").remove();

          $("#play-backward, #play-backward-background").css("visibility", "hidden");
          $("#pause-two, #pause-two-background").css("visibility", "visible");
          $("#play-forward, #play-forward-background").css("visibility", "visible");
          $("#pause-one, #pause-one-background").css("visibility", "hidden");

          drawCircles();
          drawTimeControllers();
          drawCurrentYearLabel();

          currentSpeed = speed/backwardSpeedModifier;

          animateGraph(backward, currentSpeed);

          animationInterval = setInterval(animateBackward, currentSpeed);

        };
      });// End of 'Play Backward' event handler.

      // Adding an event handler for clicking the 'Pause Two Time Button'.
      // Follows the same pattern as the ‘Pause One’ button.
      $("#pause-two, #pause-two-background").click(function() {

        stopAnimatingGraph();

        $(".current-year-label").remove();
        $(".year-control").remove();
        $(".time-line").remove();
        $(".graph-area").remove();

        drawCurrentYearLabel();
        drawTimeControllers()
        drawCircles();

        $("#play-backward, #play-backward-background").css("visibility", "visible");
        $("#pause-two, #pause-two-background").css("visibility", "hidden");

      });// End of 'Pause Two' event handler.

      // Adding an event handler for clicking the 'Skip Forward Time Button'.
      // Follows the same pattern as the ‘Skip Backward’ button.
      $("#skip-forward, #skip-forward-background").click(function() {

        if (animatingGraph) {
          stopAnimatingGraph();
        };

        if (currentYear !== lastYear) {

          currentYear = lastYear;

          $(".year-control").remove();
          $(".time-line").remove();
          $(".current-year-label").remove();
          $(".graph-area").remove();

          drawTimeControllers();
          drawCurrentYearLabel()
          drawCircles();

        };
      });// End of event handler for 'Skip Forward Time Button'.
    };// End of 'Add Event Handlers' function.
  };// End of 'Draw Time Buttons' function.

  // A function to define how to draw the 'Time Controllers'.
  function drawTimeControllers() {

    // Assigning number variables equal to the controller starting positions.
    firstYearControllerPosition = firstYearScale(firstYear) + leftMargin;
    currentYearControllerPosition = currentYearScale(currentYear) + leftMargin;
    lastYearControllerPosition = lastYearScale(lastYear) + leftMargin;

    // Appending a line to represent the date range.
    timeControls.append("line")
                .attr("class", "time-line")
                .attr("x1", 150)
                .attr("y1", 17)
                .attr("x2", graphWidth - 150)
                .attr("y2", 17);

    // Appending a new SVG to act as the dragable controller for first year.
    var firstYearController = timeControls.append("svg")
                                          .attr("class", "year-control")
                                          .attr("id", "first-year-controller")
                                          .attr("width", 28)
                                          .attr("height", 28)
                                          .attr("x", firstYearScale(firstYear))
                                          .attr("y", 3);

    // Appending a new SVG to act as the dragable controller for current year.
    var currentYearController = timeControls.append("svg")
                                            .attr("class", "year-control")
                                            .attr("id", "current-year-controller")
                                            .attr("width", 28)
                                            .attr("height", 28)
                                            .attr("x", currentYearScale(currentYear))
                                            .attr("y", 3);

    // Appending a new SVG to act as the dragable controller for last year.
    var lastYearController = timeControls.append("svg")
                                         .attr("class", "year-control")
                                         .attr("id", "last-year-controller")
                                         .attr("width", 28)
                                         .attr("height", 28)
                                         .attr("x", lastYearScale(lastYear))
                                         .attr("y", 3);

    // Appending the background for the 'First Year Controller'.
    firstYearController.append("circle")
                       .attr("cx", 14)
                       .attr("cy", 14)
                       .attr("r", 14);

    // Appending the 'First Year Controller'.
    firstYearController.append("path")
                       .attr("transform", "translate(3, 3)")
                       .attr("d", "M11.2 0c-6.186 0-11.2 5.014-11.2 11.2s5.014 11.2 11.2 11.2 11.2-5.014 11.2-11.2-5.014-11.2-11.2-11.2zM11.2 19.6c-4.639 0-8.4-3.761-8.4-8.4s3.761-8.4 8.4-8.4c4.639 0 8.4 3.761 8.4 8.4s-3.761 8.4-8.4 8.4zM7 11.2c0-2.32 1.88-4.2 4.2-4.2s4.2 1.88 4.2 4.2c0 2.32-1.88 4.2-4.2 4.2s-4.2-1.88-4.2-4.2z");

    // Appending the background for the 'Current Year Controller'.
    currentYearController.append("circle")
                         .attr("cx", 14)
                         .attr("cy", 14)
                         .attr("r", 14);

    // Appending the 'Current Year Controller'.
    currentYearController.append("path")
                         .attr("transform", "translate(3, 3)")
                         .attr("d", "M11.2 0c-6.186 0-11.2 5.014-11.2 11.2s5.014 11.2 11.2 11.2 11.2-5.014 11.2-11.2-5.014-11.2-11.2-11.2zM11.2 14c-1.546 0-2.8-1.254-2.8-2.8s1.254-2.8 2.8-2.8c1.546 0 2.8 1.254 2.8 2.8s-1.254 2.8-2.8 2.8z");

    // Appending the background for the 'Last Year Controller'.
    lastYearController.append("circle")
                      .attr("cx", 14)
                      .attr("cy", 14)
                      .attr("r", 14);

    // Appending the 'Last Year Controller'.
    lastYearController.append("path")
                      .attr("transform", "translate(3, 3)")
                      .attr("d", "M11.2 0c-6.186 0-11.2 5.014-11.2 11.2s5.014 11.2 11.2 11.2 11.2-5.014 11.2-11.2-5.014-11.2-11.2-11.2zM11.2 19.6c-4.639 0-8.4-3.761-8.4-8.4s3.761-8.4 8.4-8.4c4.639 0 8.4 3.761 8.4 8.4s-3.761 8.4-8.4 8.4zM7 11.2c0-2.32 1.88-4.2 4.2-4.2s4.2 1.88 4.2 4.2c0 2.32-1.88 4.2-4.2 4.2s-4.2-1.88-4.2-4.2z");

    // Adding and event handler for hovering over the year controls.
    $(".year-control").mouseover(function() {

      // Changing the cursor to horizontal resize.
      $(this).css('cursor', 'ew-resize');

    });

    // Adding a event handler for dragging the year controllers.
    $(".year-control").draggable().bind('drag', function(event, ui) {

      // Checking if the selected controller is for the first year.
      if (event.target.id === "first-year-controller") {

        // Checking if the selected controller is within the permitted date range.
        if (ui.position.left > (leftMargin + 151) && ui.position.left < currentYearControllerPosition - 26) {

          // Checking if an animation is in process.
          if (animatingGraph) {

            // Stoping the animation.
            stopAnimatingGraph();

            // Saving the 'Current Year Controller' and 'Current Year Label' into variables.
            var controller = d3.select("#current-year-controller");
            var label = d3.select(".current-year-label");

            // Moving the controller to the current year position.
            controller.transition()
                      .duration(1)
                      .ease(d3.easeLinear)
                      .attr("x", currentYearScale(currentYear));

            // Moving the label to the current year position.
            label.transition()
                 .duration(1)
                 .ease(d3.easeLinear)
                 .attr("x", currentYearScale(currentYear) + leftMargin + 13);

            // Updating the label text.
            label.text(currentYear);

          };// End of animation check.

          // Updating the 'Controller Position' variable.
          firstYearControllerPosition = ui.position.left;

          // Updating the 'First Year' variable.
          firstYear = Math.round(firstYearScale.invert(ui.position.left - leftMargin));

          // Updating the 'Date Range' text.
          $(".date-range").text(firstYear + " - " + lastYear);

          // Indicating a new domain is now in effect and rescaling the 'Graph Data'.
          var newDomain = true;
          scaleAllData(newDomain);

          // Removing graph elements based on old data.
          $(".grid").remove();
          $(".axis").remove();
          $(".graph-title").remove();
          $(".date-range").remove();
          $(".current-year-label").remove();
          $(".axis-label").remove();
          $(".graph-area").remove();
          $(".tooltip-one").remove();

          // Redrawing the graph elements with the new data.
          drawGraph();
          drawCircles();

          // Updating the 'Controller Position'.
          event.target.setAttribute("x", (ui.position.left - leftMargin));

        };// End of range check.

        // The following code blocks follow the same pattern as above.

      } else if (event.target.id === "current-year-controller") {

        if (ui.position.left > (firstYearControllerPosition + 26) && ui.position.left < lastYearControllerPosition - 26) {

          if (animatingGraph) {
            stopAnimatingGraph();
          };

          currentYearControllerPosition = ui.position.left;
          currentYear = Math.round(currentYearScale.invert(ui.position.left - leftMargin));

          $(".country-circle").remove();
          $(".graph-area").remove();
          $(".tooltip-one").remove();

          drawCircles();

          var label = d3.select(".current-year-label");

          label.transition()
               .duration(1)
               .ease(d3.easeLinear)
               .attr("x", ui.position.left + 13);

          label.text(currentYear);

          event.target.setAttribute("x", (ui.position.left - leftMargin));

        };

      } else if (event.target.id === "last-year-controller") {

        if (ui.position.left > (currentYearControllerPosition + 26) && ui.position.left < (leftMargin + (graphWidth - 179))) {

          if (animatingGraph) {
            stopAnimatingGraph();

            var controller = d3.select("#current-year-controller");
            var label = d3.select(".current-year-label");

            controller.transition()
                      .duration(1)
                      .ease(d3.easeLinear)
                      .attr("x", currentYearScale(currentYear));

            label.transition()
                 .duration(1)
                 .ease(d3.easeLinear)
                 .attr("x", currentYearScale(currentYear) + leftMargin + 13);

            label.text(currentYear);

          };

          lastYearControllerPosition = ui.position.left;
          lastYear = Math.round(lastYearScale.invert(ui.position.left - leftMargin));
          $(".date-range").text(firstYear + " - " + lastYear);

          var newDomain = true;
          scaleAllData(newDomain);

          $(".grid").remove();
          $(".axis").remove();
          $(".graph-title").remove();
          $(".date-range").remove();
          $(".current-year-label").remove();
          $(".axis-label").remove();
          $(".graph-area").remove();
          $(".tooltip-one").remove();

          drawGraph();
          drawCircles();

          event.target.setAttribute("x", (ui.position.left - leftMargin));

        };
      };// End of target ID check.
    });// End of draggable event handler.
  };// End of draw 'Time Controllers' function.
};// End of 'Draw Time Controls' function.

// These functions are here for development only.
function openMenu() {
  if (menuWidth < menuSize) {

    menuWidth = menuWidth + 10;

    $(".graph-zone").remove();
    $(".menu-zone").remove();
    checkEnvironment();
    scaleAllData();

    drawAll();

  } else if (menuWidth > menuSize) {

    menuWidth = menuWidth - 10;

    $(".graph-zone").remove();
    $(".menu-zone").remove();
    checkEnvironment();
    scaleAllData();

    drawAll();

  } else {
    clearInterval(menuResize);
  };
};
function closeMenu() {
  if (menuWidth > 85) {

    menuWidth = menuWidth - 10;

    $(".graph-zone").remove();
    $(".menu-zone").remove();
    checkEnvironment();
    scaleAllData();

    drawAll();

  } else {
    clearInterval(menuResize);
    $(".globe").css({"fill": "grey"});
    $(".settings").css({"fill": "grey"});
    $(".datasets").css({"fill": "grey"});
    $(".filter").css({"fill": "grey"});
    $(".share").css({"fill": "grey"});
    iconOneColor = "grey";
    iconTwoColor = "grey";
    iconThreeColor = "grey";
    iconFourColor = "grey";
    iconFiveColor = "grey";
    $(".icon-one-item").remove();
    $(".icon-two-item").remove();
    $(".icon-three-item").remove();
    $(".icon-four-item").remove();
    $(".icon-five-item").remove();
    iconOneOpen = false;
    iconTwoOpen = false;
    iconThreeOpen = false;
    iconFourOpen = false;
    iconFiveOpen = false;
  };
};

// A function that defines how to draw the 'Menu'.
function drawMenu() {

  var menuZone = d3.select("body").append("div")
                   .attr("class","menu-zone")
                   .style("width", menuWidth - 15 + "px")
                   .style("height", graphZoneHeight + 3.51 + "px");

  var menu = menuZone.append("svg")
                     .attr("class", "menu")
                     .attr("width", menuWidth - 30)
                     .attr("height", graphZoneHeight + 3.51)
                     .attr("x", 0)
                     .attr("y", 0);

  var menuBackground =  menu.append("rect")
                            .attr("x", 0)
                            .attr("y", -2)
                            .attr("width", 350)
                            .attr("height", graphZoneHeight + 7.51);

  menu.append("rect")
      .attr("class", "nav-icon-background")
      .attr("id", "home")
      .attr("width", 32)
      .attr("height", 32)
      .attr("x", 11)
      .attr("y", 20);

  menu.append("path")
      .attr("class", "nav-icon globe")
      .attr("id", "home")
      .attr("transform", "translate(11, 20)")
      .attr("d", "M32 18.451l-16-12.42-16 12.42v-5.064l16-12.42 16 12.42zM28 18v12h-8v-8h-8v8h-8v-12l12-9z")
      .style("fill", iconOneColor);

  menu.append("rect")
      .attr("class", "nav-icon-background")
      .attr("id", "settings")
      .attr("width", 32)
      .attr("height", 32)
      .attr("x", 11)
      .attr("y", 80);

  menu.append("path")
      .attr("class", "nav-icon settings")
      .attr("id", "settings")
      .attr("transform", "translate(11, 80)")
      .attr("d", "M14 4v-0.5c0-0.825-0.675-1.5-1.5-1.5h-5c-0.825 0-1.5 0.675-1.5 1.5v0.5h-6v4h6v0.5c0 0.825 0.675 1.5 1.5 1.5h5c0.825 0 1.5-0.675 1.5-1.5v-0.5h18v-4h-18zM8 8v-4h4v4h-4zM26 13.5c0-0.825-0.675-1.5-1.5-1.5h-5c-0.825 0-1.5 0.675-1.5 1.5v0.5h-18v4h18v0.5c0 0.825 0.675 1.5 1.5 1.5h5c0.825 0 1.5-0.675 1.5-1.5v-0.5h6v-4h-6v-0.5zM20 18v-4h4v4h-4zM14 23.5c0-0.825-0.675-1.5-1.5-1.5h-5c-0.825 0-1.5 0.675-1.5 1.5v0.5h-6v4h6v0.5c0 0.825 0.675 1.5 1.5 1.5h5c0.825 0 1.5-0.675 1.5-1.5v-0.5h18v-4h-18v-0.5zM8 28v-4h4v4h-4z")
      .style("fill", iconTwoColor);

  menu.append("rect")
      .attr("class", "nav-icon-background")
      .attr("id", "datasets")
      .attr("width", 32)
      .attr("height", 32)
      .attr("x", 11)
      .attr("y", 140);

  menu.append("path")
      .attr("class", "nav-icon datasets")
      .attr("id", "datasets")
      .attr("transform", "translate(11, 140)")
      .attr("d", "M16 0c-8.837 0-16 2.239-16 5v4c0 2.761 7.163 5 16 5s16-2.239 16-5v-4c0-2.761-7.163-5-16-5 M16 17c-8.837 0-16-2.239-16-5v6c0 2.761 7.163 5 16 5s16-2.239 16-5v-6c0 2.761-7.163 5-16 5 M16 26c-8.837 0-16-2.239-16-5v6c0 2.761 7.163 5 16 5s16-2.239 16-5v-6c0 2.761-7.163 5-16 5z")
      .style("fill", iconThreeColor);;

  menu.append("rect")
      .attr("class", "nav-icon-background")
      .attr("id", "filter")
      .attr("width", 32)
      .attr("height", 32)
      .attr("x", 11)
      .attr("y", 200);

  menu.append("path")
      .attr("class", "nav-icon filter")
      .attr("id", "filter")
      .attr("transform", "translate(11, 200)")
      .attr("d", "M16 0c-8.837 0-16 2.239-16 5v3l12 12v10c0 1.105 1.791 2 4 2s4-0.895 4-2v-10l12-12v-3c0-2.761-7.163-5-16-5zM2.95 4.338c0.748-0.427 1.799-0.832 3.040-1.171 2.748-0.752 6.303-1.167 10.011-1.167s7.262 0.414 10.011 1.167c1.241 0.34 2.292 0.745 3.040 1.171 0.494 0.281 0.76 0.519 0.884 0.662-0.124 0.142-0.391 0.38-0.884 0.662-0.748 0.427-1.8 0.832-3.040 1.171-2.748 0.752-6.303 1.167-10.011 1.167s-7.262-0.414-10.011-1.167c-1.24-0.34-2.292-0.745-3.040-1.171-0.494-0.282-0.76-0.519-0.884-0.662 0.124-0.142 0.391-0.38 0.884-0.662z")
      .style("fill", iconFourColor);

  menu.append("rect")
      .attr("class", "nav-icon-background")
      .attr("id", "share")
      .attr("width", 32)
      .attr("height", 32)
      .attr("x", 11)
      .attr("y", 260);

  menu.append("path")
      .attr("class", "nav-icon share")
      .attr("id", "share")
      .attr("transform", "translate(11, 260)")
      .attr("d", "M27 22c-1.411 0-2.685 0.586-3.594 1.526l-13.469-6.734c0.041-0.258 0.063-0.522 0.063-0.791s-0.022-0.534-0.063-0.791l13.469-6.734c0.909 0.94 2.183 1.526 3.594 1.526 2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5c0 0.269 0.022 0.534 0.063 0.791l-13.469 6.734c-0.909-0.94-2.183-1.526-3.594-1.526-2.761 0-5 2.239-5 5s2.239 5 5 5c1.411 0 2.685-0.586 3.594-1.526l13.469 6.734c-0.041 0.258-0.063 0.522-0.063 0.791 0 2.761 2.239 5 5 5s5-2.239 5-5c0-2.761-2.239-5-5-5z")
      .style("fill", iconFiveColor);

  if (locked) {

    menu.append("path")
        .attr("class", "lock")
        .attr("id", "locked")
        .attr("transform", "translate(11, " + (graphZoneHeight - 46) + ")")
        .attr("d", "M18.5 13h-0.5v-6c0-3.308-2.692-6-6-6h-4c-3.308 0-6 2.692-6 6v6h-0.5c-0.825 0-1.5 0.675-1.5 1.5v15c0 0.825 0.675 1.5 1.5 1.5h17c0.825 0 1.5-0.675 1.5-1.5v-15c0-0.825-0.675-1.5-1.5-1.5zM6 7c0-1.103 0.897-2 2-2h4c1.103 0 2 0.897 2 2v6h-8v-6z");

    menu.append("path")
        .attr("class", "lock")
        .attr("id", "unlocked")
        .attr("visibility", "hidden")
        .attr("transform", "translate(11, " + (graphZoneHeight - 46) + ")")
        .attr("d", "M24 1c3.308 0 6 2.692 6 6v6h-4v-6c0-1.103-0.897-2-2-2h-4c-1.103 0-2 0.897-2 2v6h0.5c0.825 0 1.5 0.675 1.5 1.5v15c0 0.825-0.675 1.5-1.5 1.5h-17c-0.825 0-1.5-0.675-1.5-1.5v-15c0-0.825 0.675-1.5 1.5-1.5h12.5v-6c0-3.308 2.692-6 6-6h4z");

  } else {

    menu.append("path")
        .attr("class", "lock")
        .attr("id", "locked")
        .attr("visibility", "hidden")
        .attr("transform", "translate(11, " + (graphZoneHeight - 46) + ")")
        .attr("d", "M18.5 13h-0.5v-6c0-3.308-2.692-6-6-6h-4c-3.308 0-6 2.692-6 6v6h-0.5c-0.825 0-1.5 0.675-1.5 1.5v15c0 0.825 0.675 1.5 1.5 1.5h17c0.825 0 1.5-0.675 1.5-1.5v-15c0-0.825-0.675-1.5-1.5-1.5zM6 7c0-1.103 0.897-2 2-2h4c1.103 0 2 0.897 2 2v6h-8v-6z");

    menu.append("path")
        .attr("class", "lock")
        .attr("id", "unlocked")
        .attr("transform", "translate(11, " + (graphZoneHeight - 46) + ")")
        .attr("d", "M24 1c3.308 0 6 2.692 6 6v6h-4v-6c0-1.103-0.897-2-2-2h-4c-1.103 0-2 0.897-2 2v6h0.5c0.825 0 1.5 0.675 1.5 1.5v15c0 0.825-0.675 1.5-1.5 1.5h-17c-0.825 0-1.5-0.675-1.5-1.5v-15c0-0.825 0.675-1.5 1.5-1.5h12.5v-6c0-3.308 2.692-6 6-6h4z");

  };

  function iconOneMenu() {

    if (iconOneOpen) {

      menuSize = 145;

      menu.append("rect")
          .attr("class", "icon-one-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 20)
          .on("click", function() { window.open("http://data.worldbank.org/"); });

      menu.append("path")
          .attr("class", "icon-one-item icon-one-icon")
          .attr("transform", "translate(66, 20)")
          .attr("d", "M15 2c-8.284 0-15 6.716-15 15s6.716 15 15 15c8.284 0 15-6.716 15-15s-6.716-15-15-15zM23.487 22c0.268-1.264 0.437-2.606 0.492-4h3.983c-0.104 1.381-0.426 2.722-0.959 4h-3.516zM6.513 12c-0.268 1.264-0.437 2.606-0.492 4h-3.983c0.104-1.381 0.426-2.722 0.959-4h3.516zM21.439 12c0.3 1.28 0.481 2.62 0.54 4h-5.979v-4h5.439zM16 10v-5.854c0.456 0.133 0.908 0.355 1.351 0.668 0.831 0.586 1.625 1.488 2.298 2.609 0.465 0.775 0.867 1.638 1.203 2.578h-4.852zM10.351 7.422c0.673-1.121 1.467-2.023 2.298-2.609 0.443-0.313 0.895-0.535 1.351-0.668v5.854h-4.852c0.336-0.94 0.738-1.803 1.203-2.578zM14 12v4h-5.979c0.059-1.38 0.24-2.72 0.54-4h5.439zM2.997 22c-0.533-1.278-0.854-2.619-0.959-4h3.983c0.055 1.394 0.224 2.736 0.492 4h-3.516zM8.021 18h5.979v4h-5.439c-0.3-1.28-0.481-2.62-0.54-4zM14 24v5.854c-0.456-0.133-0.908-0.355-1.351-0.668-0.831-0.586-1.625-1.488-2.298-2.609-0.465-0.775-0.867-1.638-1.203-2.578h4.852zM19.649 26.578c-0.673 1.121-1.467 2.023-2.298 2.609-0.443 0.312-0.895 0.535-1.351 0.668v-5.854h4.852c-0.336 0.94-0.738 1.802-1.203 2.578zM16 22v-4h5.979c-0.059 1.38-0.24 2.72-0.54 4h-5.439zM23.98 16c-0.055-1.394-0.224-2.736-0.492-4h3.516c0.533 1.278 0.855 2.619 0.959 4h-3.983zM25.958 10h-2.997c-0.582-1.836-1.387-3.447-2.354-4.732 1.329 0.636 2.533 1.488 3.585 2.54 0.671 0.671 1.261 1.404 1.766 2.192zM5.808 7.808c1.052-1.052 2.256-1.904 3.585-2.54-0.967 1.285-1.771 2.896-2.354 4.732h-2.997c0.504-0.788 1.094-1.521 1.766-2.192zM4.042 24h2.997c0.583 1.836 1.387 3.447 2.354 4.732-1.329-0.636-2.533-1.488-3.585-2.54-0.671-0.671-1.261-1.404-1.766-2.192zM24.192 26.192c-1.052 1.052-2.256 1.904-3.585 2.54 0.967-1.285 1.771-2.896 2.354-4.732h2.997c-0.504 0.788-1.094 1.521-1.766 2.192z")
          .on("click", function() { window.open("http://data.worldbank.org/"); });

      menu.append("text")
          .attr("class", "icon-one-item menu-label")
          .attr("x", 82)
          .attr("y",  60)
          .attr("dy", ".35em")
          .text("Data Source")
          .on("click", function() { window.open("http://data.worldbank.org/"); });

      menu.append("rect")
          .attr("class", "icon-one-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 80)
          .on("click", function() { window.open("https://github.com/jgphilpott/iGraph"); });

      menu.append("path")
          .attr("class", "icon-one-item icon-one-icon")
          .attr("transform", "translate(66, 80)")
          .attr("d", "M16 0.395c-8.836 0-16 7.163-16 16 0 7.069 4.585 13.067 10.942 15.182 0.8 0.148 1.094-0.347 1.094-0.77 0-0.381-0.015-1.642-0.022-2.979-4.452 0.968-5.391-1.888-5.391-1.888-0.728-1.849-1.776-2.341-1.776-2.341-1.452-0.993 0.11-0.973 0.11-0.973 1.606 0.113 2.452 1.649 2.452 1.649 1.427 2.446 3.743 1.739 4.656 1.33 0.143-1.034 0.558-1.74 1.016-2.14-3.554-0.404-7.29-1.777-7.29-7.907 0-1.747 0.625-3.174 1.649-4.295-0.166-0.403-0.714-2.030 0.155-4.234 0 0 1.344-0.43 4.401 1.64 1.276-0.355 2.645-0.532 4.005-0.539 1.359 0.006 2.729 0.184 4.008 0.539 3.054-2.070 4.395-1.64 4.395-1.64 0.871 2.204 0.323 3.831 0.157 4.234 1.026 1.12 1.647 2.548 1.647 4.295 0 6.145-3.743 7.498-7.306 7.895 0.574 0.497 1.085 1.47 1.085 2.963 0 2.141-0.019 3.864-0.019 4.391 0 0.426 0.288 0.925 1.099 0.768 6.354-2.118 10.933-8.113 10.933-15.18 0-8.837-7.164-16-16-16z")
          .on("click", function() { window.open("https://github.com/jgphilpott/iGraph"); });

      menu.append("text")
          .attr("class", "icon-one-item menu-label")
          .attr("x", 82)
          .attr("y",  120)
          .attr("dy", ".35em")
          .text("Source Code")
          .on("click", function() { window.open("https://github.com/jgphilpott/iGraph"); });

      menu.append("rect")
          .attr("class", "icon-one-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 140)
          .on("click", function() { window.open("https://en.wikipedia.org/wiki/Trendalyzer"); });

      menu.append("path")
          .attr("class", "icon-one-item icon-one-icon")
          .attr("transform", "translate(66, 140)")
          .attr("d", "M30.212 7.3c0 0.1-0.031 0.194-0.094 0.281-0.063 0.081-0.131 0.125-0.212 0.125-0.625 0.063-1.137 0.263-1.531 0.6-0.4 0.338-0.806 0.994-1.225 1.95l-6.45 14.544c-0.044 0.137-0.163 0.2-0.356 0.2-0.15 0-0.269-0.069-0.356-0.2l-3.619-7.563-4.162 7.563c-0.088 0.137-0.2 0.2-0.356 0.2-0.188 0-0.306-0.069-0.369-0.2l-6.331-14.537c-0.394-0.9-0.813-1.531-1.25-1.887s-1.050-0.581-1.831-0.662c-0.069 0-0.131-0.037-0.188-0.106-0.063-0.069-0.087-0.15-0.087-0.244 0-0.237 0.069-0.356 0.2-0.356 0.562 0 1.156 0.025 1.775 0.075 0.575 0.050 1.112 0.075 1.619 0.075 0.513 0 1.125-0.025 1.825-0.075 0.731-0.050 1.381-0.075 1.95-0.075 0.137 0 0.2 0.119 0.2 0.356s-0.044 0.35-0.125 0.35c-0.563 0.044-1.012 0.188-1.338 0.431s-0.487 0.563-0.487 0.963c0 0.2 0.069 0.456 0.2 0.756l5.231 11.825 2.975-5.613-2.769-5.806c-0.5-1.037-0.906-1.706-1.225-2.006s-0.806-0.481-1.456-0.55c-0.063 0-0.113-0.037-0.169-0.106s-0.081-0.15-0.081-0.244c0-0.237 0.056-0.356 0.175-0.356 0.563 0 1.081 0.025 1.556 0.075 0.456 0.050 0.938 0.075 1.456 0.075 0.506 0 1.037-0.025 1.606-0.075 0.581-0.050 1.156-0.075 1.719-0.075 0.137 0 0.2 0.119 0.2 0.356s-0.038 0.35-0.125 0.35c-1.131 0.075-1.694 0.4-1.694 0.963 0 0.25 0.131 0.644 0.394 1.175l1.831 3.719 1.825-3.4c0.25-0.481 0.381-0.887 0.381-1.213 0-0.775-0.563-1.188-1.694-1.237-0.1 0-0.15-0.119-0.15-0.35 0-0.088 0.025-0.162 0.075-0.237s0.1-0.112 0.15-0.112c0.406 0 0.9 0.025 1.494 0.075 0.563 0.050 1.031 0.075 1.394 0.075 0.262 0 0.644-0.025 1.15-0.063 0.637-0.056 1.175-0.088 1.606-0.088 0.1 0 0.15 0.1 0.15 0.3 0 0.269-0.094 0.406-0.275 0.406-0.656 0.069-1.188 0.25-1.587 0.544s-0.9 0.963-1.5 2.013l-2.444 4.475 3.288 6.7 4.856-11.294c0.169-0.412 0.25-0.794 0.25-1.137 0-0.825-0.563-1.263-1.694-1.319-0.1 0-0.15-0.119-0.15-0.35 0-0.237 0.075-0.356 0.225-0.356 0.413 0 0.9 0.025 1.469 0.075 0.525 0.050 0.962 0.075 1.313 0.075 0.375 0 0.8-0.025 1.288-0.075 0.506-0.050 0.962-0.075 1.369-0.075 0.125 0 0.188 0.1 0.188 0.3z")
          .on("click", function() { window.open("https://en.wikipedia.org/wiki/Trendalyzer"); });

      menu.append("text")
          .attr("class", "icon-one-item menu-label")
          .attr("x", 82)
          .attr("y",  180)
          .attr("dy", ".35em")
          .text("Original")
          .on("click", function() { window.open("https://en.wikipedia.org/wiki/Trendalyzer"); });

      $(".icon-one-item").mouseover(function() {
        $(this).css('cursor', 'pointer');
      });

    };
  };

  function iconTwoMenu() {
    if (iconTwoOpen) {
      menuSize = 285;
    };
  };

  function iconThreeMenu() {
    if (iconThreeOpen) {
      menuSize = 285;
    };
  };

  // A function that defines how to draw the filter menu.
  function iconFourMenu() {

    // Checking if the corresponding 'Open' variable is true.
    if (iconFourOpen) {

      // Reassigning a the 'Menu Size' variable.
      menuSize = 355;

      // Declaring the 'Total Extension' variable to track how far the menu expends past the window height.
      var totalExtension = 0;

      // Declaring a variable to control the spacing of elements.
      var spaceing = 20;

      // Declaring an array of strings equal to the 'Geographic Region Names' array in a class name format.
      var classifiedGeographicRegionNames = geographicRegionNames.map(function(item) {
        return item.replace(/&/g, "and").replace(/\s/g, "-").toLowerCase();
      });

      // Adding category folders and filter controls.
      for (var i = 0; i < geographicRegionNames.length; i++) {

        menu.append("rect")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " colour-legend")
            .attr("width", 13)
            .attr("height", 13)
            .attr("x", 66)
            .attr("y", 12 + (i * spaceing))
            .style("fill", colors[i]);

        menu.append("rect")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " checkbox-unchecked-background")
            .attr("width", 11)
            .attr("height", 11)
            .attr("x", 88.5)
            .attr("y", 12.5 + (i * spaceing));

        menu.append("path")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " checkbox-unchecked")
            .attr("transform", "translate(86, " + (10 + (i * spaceing)) + ")")
            .attr("d", "M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM14 14h-12v-12h12v12z");

        menu.append("rect")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " checkbox-checked-background")
            .attr("width", 11)
            .attr("height", 11)
            .attr("x", 88.5)
            .attr("y", 12.5 + (i * spaceing))
            .attr("visibility", function() {

              for (var j = 0; j < drawRegionsExceptionList.length; j++) {
                if (drawRegionsExceptionList[j] === classifiedGeographicRegionNames[i]) {

                  return "hidden";

                };
              };

              return "visible";

            });

        menu.append("path")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " checkbox-checked")
            .attr("transform", "translate(86, " + (10 + (i * spaceing)) + ")")
            .attr("d", "M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM7 12.414l-3.707-3.707 1.414-1.414 2.293 2.293 4.793-4.793 1.414 1.414-6.207 6.207z")
            .attr("visibility", function() {

              for (var j = 0; j < drawRegionsExceptionList.length; j++) {
                if (drawRegionsExceptionList[j] === classifiedGeographicRegionNames[i]) {

                  return "hidden";

                };
              };

              return "visible";

            });

        menu.append("rect")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " folder-minus-background")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", 114)
            .attr("y", 16 + (i * spaceing))
            .attr("visibility", "hidden");

        menu.append("path")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " folder-minus")
            .attr("transform", "translate(109, " + (10 + (i * spaceing)) + ")")
            .attr("d", "M9 3.5l-2-2h-7v13h16v-11h-7zM11 10.5h-6v-2h6v2z")
            .attr("visibility", "hidden");

        menu.append("rect")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " folder-plus-background")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", 114)
            .attr("y", 16 + (i * spaceing));

        menu.append("path")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " folder-plus")
            .attr("transform", "translate(109, " + (10 + (i * spaceing)) + ")")
            .attr("d", "M9 3.5l-2-2h-7v13h16v-11h-7zM11 10.5h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2z");

        menu.append("text")
            .attr("class", "icon-four-item " + classifiedGeographicRegionNames[i] + " menu-title")
            .attr("x", 130)
            .attr("y",  20 + (i * spaceing))
            .attr("dy", ".35em")
            .text(geographicRegionNames[i]);

      };

      // A function to transition all the currently drawn objects when opening/closing a folder.
      function transitionObjects(index, extension) {

        // Looping over the list of 'Classified Geographic Region Names' array.
        for (var i = 0; i < classifiedGeographicRegionNames.length; i++) {

          // Checking if the current loop index is greater than the 'Index' argument.
          if (i > index) {

            // Saving all elements below the folder being opened/closed into variables.
            var colourLegend = $("." + classifiedGeographicRegionNames[i] + ".colour-legend");
            var checkboxUnchecked = $("." + classifiedGeographicRegionNames[i] + ".checkbox-unchecked");
            var checkboxUncheckedBackground = $("." + classifiedGeographicRegionNames[i] + ".checkbox-unchecked-background");
            var subCheckboxUnchecked = $("." + classifiedGeographicRegionNames[i] + "-country.sub-checkbox-unchecked");
            var subCheckboxUncheckedBackground = $("." + classifiedGeographicRegionNames[i] + "-country.sub-checkbox-unchecked-background");
            var checkboxChecked = $("." + classifiedGeographicRegionNames[i] + ".checkbox-checked");
            var checkboxCheckedBackground = $("." + classifiedGeographicRegionNames[i] + ".checkbox-checked-background");
            var subCheckboxChecked = $("." + classifiedGeographicRegionNames[i] + "-country.sub-checkbox-checked");
            var subCheckboxCheckedBackground = $("." + classifiedGeographicRegionNames[i] + "-country.sub-checkbox-checked-background");
            var folderMinus = $("." + classifiedGeographicRegionNames[i] + ".folder-minus");
            var folderMinusBackground = $("." + classifiedGeographicRegionNames[i] + ".folder-minus-background");
            var folderPlus = $("." + classifiedGeographicRegionNames[i] + ".folder-plus");
            var folderPlusBackground = $("." + classifiedGeographicRegionNames[i] + ".folder-plus-background");
            var menuTitle = $("." + classifiedGeographicRegionNames[i] + ".menu-title");
            var menuText = $("." + classifiedGeographicRegionNames[i] + "-country.menu-text");

            // The following code blocks transition each element from its curent location to it's new location based on the 'Extension' variable.

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".colour-legend")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("y", extension + Number(colourLegend[0].attributes[4].value));

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".checkbox-unchecked")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("transform", "translate(86, " + (extension + checkboxUnchecked[0].transform.animVal[0].matrix.f) + ")");

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".checkbox-unchecked-background")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("y", extension + Number(checkboxUncheckedBackground[0].attributes[4].value));

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".checkbox-checked")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("transform", "translate(86, " + (extension + checkboxChecked[0].transform.animVal[0].matrix.f) + ")");

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".checkbox-checked-background")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("y", extension + Number(checkboxCheckedBackground[0].attributes[4].value));

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".folder-minus")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("transform", "translate(109 " + (extension + folderMinus[0].transform.animVal[0].matrix.f) + ")");

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".folder-minus-background")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("y", extension + Number(folderMinusBackground[0].attributes[4].value));

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".folder-plus")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("transform", "translate(109 " + (extension + folderPlus[0].transform.animVal[0].matrix.f) + ")");

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".folder-plus-background")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("y", extension + Number(folderPlusBackground[0].attributes[4].value));

            d3.selectAll("." + classifiedGeographicRegionNames[i] + ".menu-title")
              .transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("y", extension + Number(menuTitle[0].attributes[2].value));

            // Checking if sub folder items exist for this region...
            if (menuText.length !== 0) {

              // Looping over the array of 'Sub Unchecked Boxs'.
              // Applying the same transition as above for each sub element.
              for (var j = 0; j < subCheckboxUnchecked.length; j++) {

                d3.selectAll("." + subCheckboxUnchecked[j].classList[2] + ".sub-checkbox-unchecked")
                  .transition()
                  .duration(1)
                  .ease(d3.easeLinear)
                  .attr("transform", "translate(135, " + (extension + subCheckboxUnchecked[j].transform.animVal[0].matrix.f) + ")");

                d3.selectAll("." + subCheckboxUncheckedBackground[j].classList[2] + ".sub-checkbox-unchecked-background")
                  .transition()
                  .duration(1)
                  .ease(d3.easeLinear)
                  .attr("y", extension + Number(subCheckboxUncheckedBackground[j].attributes[4].value));

                d3.selectAll("." + menuText[j].classList[2] + ".menu-text")
                  .transition()
                  .duration(1)
                  .ease(d3.easeLinear)
                  .attr("y", extension + Number(menuText[j].attributes[2].value));

              };

              // Looping over the array of 'Sub Checked Boxs'.
              // Applying the same transition as above for each sub element.
              for (var j = 0; j < subCheckboxChecked.length; j++) {

                d3.selectAll("." + subCheckboxChecked[j].classList[2] + ".sub-checkbox-checked")
                  .transition()
                  .duration(1)
                  .ease(d3.easeLinear)
                  .attr("transform", "translate(135, " + (extension + subCheckboxChecked[j].transform.animVal[0].matrix.f) + ")");


                d3.selectAll("." + subCheckboxCheckedBackground[j].classList[2] + ".sub-checkbox-checked-background")
                  .transition()
                  .duration(1)
                  .ease(d3.easeLinear)
                  .attr("y", extension + Number(subCheckboxCheckedBackground[j].attributes[4].value));

              };
            };// End of 'Sub Items' check.
          };// End of 'Index' check.
        };// End of 'Classified Geographic Region Names' array loop.
      };// End of 'Transition Objects' function.

      // A function that defines how to open a category folder.
      function openFolder(folderName, category) {

        // Saving the index of the ‘Classified Geographic Region Names’ array that matches the ‘Folder Name’.
        for (var i = 0; i < classifiedGeographicRegionNames.length; i++) {
          if (classifiedGeographicRegionNames[i] === folderName) {
            var index = i;
          };
        };

        // Declaring the 'Starting Point' variable as equal to the curent folders 'y' value.
        var startingPoint = Number($("." + classifiedGeographicRegionNames[index] + ".menu-title")[0].attributes[2].value);

        // Determining the extension variable for this category.
        var extension = category.length * spaceing;

        // Reassigning the 'Total Extension' variable with the addition of the 'Extension' variable.
        totalExtension = totalExtension + extension;

        // Checking if the extended menu height is greter than the window height.
        if ((graphZoneHeight + 3.51 + (totalExtension - graphZoneHeight + 3.51) + (classifiedGeographicRegionNames.length * spaceing) + spaceing/2) > (graphZoneHeight + 3.51)) {

          // Transitioning the menu height.
          menu.transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("height", graphZoneHeight + 3.51 + (totalExtension - graphZoneHeight + 3.51) + (classifiedGeographicRegionNames.length * spaceing) + spaceing/2)

          // Transitioning the menu background height.
          menuBackground.transition()
                        .duration(1)
                        .ease(d3.easeLinear)
                        .attr("height", graphZoneHeight + 7.51 + (totalExtension - graphZoneHeight + 7.51) + (classifiedGeographicRegionNames.length * spaceing) + spaceing/2)

        };// End of menu height check.

        // Transitioning existing objects to make room for the new 'Sub Folder Objects'.
        transitionObjects(index, extension);

        // A function that defines how to draw the 'Country Filter Objects'.
        function addSubFolderObjects(objectName, data) {

          // Declaring a string equal to the current 'Object Name' in class name format.
          var classifiedCountryName = objectName.replace(/[.,\/#!$%\^&\*;:{}=\-_`'’~()]/g, "").replace(/\s/g, "-").toLowerCase();

          // Appending the 'Unchecked Checkbox Background'.
          menu.append("rect")
              .attr("class", function() {

                // Checking if there is data available for this country...
                // Adding an additional ‘no-data’ class if false.
                if (data) {
                  return "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " sub-checkbox-unchecked-background";
                } else {
                  return "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " sub-checkbox-unchecked-background no-data";
                };
              })
              .attr("width", 5.8)
              .attr("height", 5.8)
              .attr("x", 137)
              .attr("y", startingPoint + 17 + (j * spaceing));

          // Appending the 'Unchecked Checkbox'.
          menu.append("path")
              .attr("class", function() {
                if (data) {
                  return "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " sub-checkbox-unchecked";
                } else {
                  return "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " sub-checkbox-unchecked no-data";
                };
              })
              .attr("transform", "translate(135, " + (startingPoint + 15 + (j * spaceing)) + ")")
              .attr("d", "M8.4 0h-7.2c-0.66 0-1.2 0.54-1.2 1.2v7.2c0 0.66 0.54 1.2 1.2 1.2h7.2c0.66 0 1.2-0.54 1.2-1.2v-7.2c0-0.66-0.54-1.2-1.2-1.2zM8.4 8.4h-7.2v-7.2h7.2v7.2z");

          // Checking if there is data available for this country.
          if (data) {

            // Appending the 'Checked Checkbox Background'.
            menu.append("rect")
                .attr("class", "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " sub-checkbox-checked-background")
                .attr("width", 5.8)
                .attr("height", 5.8)
                .attr("x", 137)
                .attr("y", startingPoint + 17 + (j * spaceing))
                .attr("visibility", function() {

                  // Looping over the 'Countries Exception List' array.
                  for (var k = 0; k < drawCountriesExceptionList.length; k++) {

                    // Checking if the current countries name is included in the list.
                    if (drawCountriesExceptionList[k] === classifiedCountryName) {
                      return "hidden";
                    };
                  };

                  // If no match is found in the exception list...
                  return "visible";

                });

            // Appending the 'Checked Checkbox'.
            menu.append("path")
                .attr("class", "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " sub-checkbox-checked")
                .attr("transform", "translate(135, " + (startingPoint + 15 + (j * spaceing)) + ")")
                .attr("d", "M8.4 0h-7.2c-0.66 0-1.2 0.54-1.2 1.2v7.2c0 0.66 0.54 1.2 1.2 1.2h7.2c0.66 0 1.2-0.54 1.2-1.2v-7.2c0-0.66-0.54-1.2-1.2-1.2zM4.2 7.449l-2.224-2.224 0.849-0.849 1.376 1.376 2.876-2.876 0.849 0.849-3.724 3.724z")
                .attr("visibility", function() {
                  for (var k = 0; k < drawCountriesExceptionList.length; k++) {
                    if (drawCountriesExceptionList[k] === classifiedCountryName) {
                      return "hidden";
                    };
                  };
                  return "visible";
                });

          };

          // Appending the current countries name as a label.
          menu.append("text")
              .attr("class", function() {

                // Checking if there is data available for this country...
                // Adding an additional ‘menu-no-data-text’ class if false.
                if (data) {
                  return "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " menu-text";
                } else {
                  return "icon-four-item " + classifiedGeographicRegionNames[index] + "-country " + classifiedCountryName + " menu-text menu-no-data-text"
                };
              })
              .attr("x", 150)
              .attr("y", startingPoint + 20 + (j * spaceing))
              .attr("dy", ".35em")
              .text(objectName);

        };// End of 'Add Sub Folder Objects' function.

        // Looping over the 'Graph Data' array.
        for (var i = 0; i < graphData.length; i++) {

          // Looping over the current 'Category' array.
          for (var j = 0; j < category.length; j++) {

            // Checking if the first object at the current 'Graph Data' index has a code that matches the current 'Category' index.
            if (graphData[i][0].Code === category[j]) {

              // Looping over the array located at 'i' of the 'Scaled Graph Data' array.
              for (var k = 0; k < scaledGraphData[i].length; k++) {

                // Checking if the year of the object at the current index matches the 'Curent Year' variable.
                if (scaledGraphData[i][k].Year === currentYear) {

                  // Declaring 'Data' to be true and calling the function that adds the current country object to the list.
                  var data = true;
                  addSubFolderObjects(graphData[i][0].Name, data);
                  break;

                } else if (scaledGraphData[i][k].Year >= currentYear) {

                  // If no object was found with a year matching the 'Curent Year'...
                  // Call the function that adds the current country object to the list, without the 'Data' argument.
                  addSubFolderObjects(graphData[i][0].Name);
                  break;

                };// End of 'Current Year' check.
              };// End of 'Scaled Graph Data' array loop.

              // Checking the length of the array located at 'i' of the 'Scaled Graph Data' array.
              if (scaledGraphData[i].length === 0) {

                // Call the function that adds the current country object to the list, without the 'Data' argument.
                addSubFolderObjects(graphData[i][0].Name);

              };// End of length check.

              // Breaking the 'Category' array loop.
              break;

            };// End of matching code check.
          };// End of 'Category' array loop.
        };// End of 'Graph Data' array loop.

        // Attaching an event handeler for clicking the 'Sub Checked Box'.
        $(".sub-checkbox-checked, .sub-checkbox-checked-background").click(function() {

          // Hideing the 'Sub Checked Box'.
          $("." + this.classList[2] + ".sub-checkbox-checked, ." + this.classList[2] + ".sub-checkbox-checked-background").css("visibility", "hidden");

          // Removing the corresponding 'Country Circle'.
          $("." + this.classList[2] + ".country-circle").remove();

          // Adding the corresponding 'Country Name' to the exception list.
          drawCountriesExceptionList.push(this.classList[2]);

        });// End of 'Sub Checked Box' event handeler.

        // Attaching an event handeler for clicking the 'Sub Unchecked Box'.
        $(".sub-checkbox-unchecked, .sub-checkbox-unchecked-background").click(function() {

          // Makeing the 'Sub Checked Box' visible.
          $("." + this.classList[2] + ".sub-checkbox-checked, ." + this.classList[2] + ".sub-checkbox-checked-background").css("visibility", "visible");

          // Looping over the 'Countries Exception List'...
          // Checking if the 'Country Name' of the clicked object matches the string at the index of the loop...
          // Removing the 'Country Name' from the exception list and breaking the loop.
          for (var i = 0; i < drawCountriesExceptionList.length; i++) {
            if (drawCountriesExceptionList[i] === this.classList[2]) {
              drawCountriesExceptionList.splice(i, 1);
              break;
            };
          };

          // Looping over the 'Regions Exception List'...
          // Checking if the 'Regions Name' of the clicked object matches the string at the index of the loop...
          // Removing the 'Regions Name' from the exception list and breaking the loop.
          for (var i = 0; i < drawRegionsExceptionList.length; i++) {
            if (drawRegionsExceptionList[i] === this.classList[1].replace(/-country/, "")) {
              drawRegionsExceptionList.splice(i, 1);
              $("." + this.classList[1].replace(/-country/, "") + ".checkbox-checked").css("visibility", "visible");
              break;
            };
          };

          // Removing and redrawing the 'Country Circles'.
          $(".country-circle").remove();
          drawCircles();

        });// End of 'Sub Unchecked Box' event handeler.

        // Attaching an event handeler for styleing the cursor while over the 'Sub Check Boxs'.
        $(".sub-checkbox-checked, .sub-checkbox-checked-background, .sub-checkbox-unchecked, .sub-checkbox-unchecked-background").mouseover(function() {

          // Checking if the 'Check Box' class list contains 'no-data' and styleing the cursor appropriatly.
          if (this.classList.contains("no-data")) {
            $(this).css("cursor", "not-allowed");
          } else {
            $(this).css("cursor", "pointer");
          };
        });// End of cursor styleing event handeler.
      };// End of 'Open Folder Function'.

      // A function that defines how to close a category folder.
      function closeFolder(folderName, category) {

        // Saving the index of the ‘Classified Geographic Region Names’ array that matches the ‘Folder Name’.
        for (var i = 0; i < classifiedGeographicRegionNames.length; i++) {
          if (classifiedGeographicRegionNames[i] === folderName) {
            var index = i;
          };
        };

        // Determining the extension variable for this category.
        var extension = -(category.length * 20);

        // Reassigning the 'Total Extension' variable with the addition of the 'Extension' variable.
        totalExtension = totalExtension + extension;

        // Checking if the extended menu height is greter than the window height.
        if ((graphZoneHeight + 3.51 + (totalExtension - graphZoneHeight + 3.51) + (classifiedGeographicRegionNames.length * spaceing) + spaceing/2) > (graphZoneHeight + 3.51)) {

          // Transitioning the menu height.
          menu.transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("height", graphZoneHeight + 3.51 + (totalExtension - graphZoneHeight + 3.51) + (classifiedGeographicRegionNames.length * spaceing) + spaceing/2)

          // Transitioning the menu background height.
          menuBackground.transition()
                        .duration(1)
                        .ease(d3.easeLinear)
                        .attr("height", graphZoneHeight + 7.51 + (totalExtension - graphZoneHeight + 7.51) + (classifiedGeographicRegionNames.length * spaceing) + spaceing/2)

        } else {

          // Transitioning the menu height.
          menu.transition()
              .duration(1)
              .ease(d3.easeLinear)
              .attr("height", graphZoneHeight + 3.51)

          // Transitioning the menu background height.
          menuBackground.transition()
                        .duration(1)
                        .ease(d3.easeLinear)
                        .attr("height", graphZoneHeight + 7.51)

        } // End of menu height check.

        // Removing 'Sub Folder Objects'.
        $("." + folderName + "-country").remove();

        // Transitioning existing objects to account for the removal of the old 'Sub Folder Objects'.
        transitionObjects(index, extension);

      };// End of 'Close Folder' function.

      function modifyCountriesExceptionList(modify, category) {

        if (modify === "add") {
          for (var i = 0; i < graphData.length; i++) {
            for (var j = 0; j < category.length; j++) {
              if (category[j] === graphData[i][0].Code) {
                drawCountriesExceptionList.push(graphData[i][0].Name.replace(/[.,\/#!$%\^&\*;:{}=\-_`'’~()]/g, "").replace(/\s/g, "-").toLowerCase());
                break;
              };
            };
          };
        } else if (modify === "remove") {
          for (var i = 0; i < graphData.length; i++) {
            for (var j = 0; j < category.length; j++) {
              if (category[j] === graphData[i][0].Code) {
                for (var k = 0; k < drawCountriesExceptionList.length; k++) {
                  if (drawCountriesExceptionList[k] === graphData[i][0].Name.replace(/[.,\/#!$%\^&\*;:{}=\-_`'’~()]/g, "").replace(/\s/g, "-").toLowerCase()) {
                    drawCountriesExceptionList.splice(k, 1);
                    break;
                  };
                };
                break;
              };
            };
          };
        } else {
          console.log("Error in 'Modify Countries Exception List' function!");
        };
      };

      $(".checkbox-checked, .checkbox-checked-background").click(function() {

        $("." + this.classList[1] + ".checkbox-checked, ." + this.classList[1] + ".checkbox-checked-background").css("visibility", "hidden");

        $("." + this.classList[1] + ".country-circle").remove();

        drawRegionsExceptionList.push(this.classList[1]);

        var modify = "add";

        switch (this.classList[1]) {

          case "east-asia-and-pacific":

            modifyCountriesExceptionList(modify, eastAsiaAndPacific)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          case "europe-and-central-asia":

            modifyCountriesExceptionList(modify, europeAndCentralAsia);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          case "latin-america-and-caribbean":

            modifyCountriesExceptionList(modify, latinAmericaAndCaribbean);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          case "midle-east-and-north-africa":

            modifyCountriesExceptionList(modify, midleEastAndNorthAfrica);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          case "north-america":

            modifyCountriesExceptionList(modify, northAmerica);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          case "south-asia":

            modifyCountriesExceptionList(modify, southAsia);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          case "sub-saharan-africa":

            modifyCountriesExceptionList(modify, subSaharanAfrica);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "hidden");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "hidden");
                break;
              };
            };

            break;

          default:
            console.log("Error in checkbox checked switch!");

        };
      });

      $(".checkbox-unchecked, .checkbox-unchecked-background").click(function() {

        $("." + this.classList[1] + ".checkbox-checked, ." + this.classList[1] + ".checkbox-checked-background").css("visibility", "visible");

        for (var i = 0; i < drawRegionsExceptionList.length; i++) {
          if (drawRegionsExceptionList[i] === this.classList[1]) {
            drawRegionsExceptionList.splice(i, 1);
          };
        };

        var modify = "remove";

        switch (this.classList[1]) {

          case "east-asia-and-pacific":

            modifyCountriesExceptionList(modify, eastAsiaAndPacific);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "visible");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "visible");
              };
            };

            break;

          case "europe-and-central-asia":

            modifyCountriesExceptionList(modify, europeAndCentralAsia)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "visible");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "visible");
              };
            };

            break;

          case "latin-america-and-caribbean":

            modifyCountriesExceptionList(modify, latinAmericaAndCaribbean)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "visible");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "visible");
              };
            };

            break;

          case "midle-east-and-north-africa":

            modifyCountriesExceptionList(modify, midleEastAndNorthAfrica)
            break;

          case "north-america":

            modifyCountriesExceptionList(modify, northAmerica)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "visible");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "visible");
              };
            };

            break;

          case "south-asia":

            modifyCountriesExceptionList(modify, southAsia)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "visible");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "visible");
              };
            };

            break;

          case "sub-saharan-africa":

            modifyCountriesExceptionList(modify, subSaharanAfrica)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                $("." + this.classList[1] + "-country.sub-checkbox-checked").css("visibility", "visible");
                $("." + this.classList[1] + "-country.sub-checkbox-checked-background").css("visibility", "visible");
              };
            };

            break;

          default:
            console.log("Error in checkbox checked switch!");

        };

        $(".country-circle").remove();
        drawCircles();

      });

      $(".folder-plus, .folder-plus-background").click(function() {

        $("." + this.classList[1] + ".folder-plus, ." + this.classList[1] + ".folder-plus-background").css("visibility", "hidden");
        $("." + this.classList[1] + ".folder-minus, ." + this.classList[1] + ".folder-minus-background").css("visibility", "visible");

        switch (this.classList[1]) {

          case "east-asia-and-pacific":

            openFolder(this.classList[1], eastAsiaAndPacific);
            openFoldersList.push(this.classList[1]);
            break;

          case "europe-and-central-asia":

            openFolder(this.classList[1], europeAndCentralAsia);
            openFoldersList.push(this.classList[1]);
            break;

          case "latin-america-and-caribbean":

            openFolder(this.classList[1], latinAmericaAndCaribbean);
            openFoldersList.push(this.classList[1]);
            break;

          case "midle-east-and-north-africa":

            openFolder(this.classList[1], midleEastAndNorthAfrica);
            openFoldersList.push(this.classList[1]);
            break;

          case "north-america":

            openFolder(this.classList[1], northAmerica);
            openFoldersList.push(this.classList[1]);
            break;

          case "south-asia":

            openFolder(this.classList[1], southAsia);
            openFoldersList.push(this.classList[1]);
            break;

          case "sub-saharan-africa":

            openFolder(this.classList[1], subSaharanAfrica);
            openFoldersList.push(this.classList[1]);
            break;

          default:
            console.log("Error in folder plus switch!");

        };
      });

      $(".folder-minus, .folder-minus-background").click(function() {

        $("." + this.classList[1] + ".folder-plus, ." + this.classList[1] + ".folder-plus-background").css("visibility", "visible");
        $("." + this.classList[1] + ".folder-minus, ." + this.classList[1] + ".folder-minus-background").css("visibility", "hidden");

        switch (this.classList[1]) {

          case "east-asia-and-pacific":

            closeFolder(this.classList[1], eastAsiaAndPacific);

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          case "europe-and-central-asia":

            closeFolder(this.classList[1], europeAndCentralAsia)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          case "latin-america-and-caribbean":

            closeFolder(this.classList[1], latinAmericaAndCaribbean)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          case "midle-east-and-north-africa":

            closeFolder(this.classList[1], midleEastAndNorthAfrica)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          case "north-america":

            closeFolder(this.classList[1], northAmerica)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          case "south-asia":

            closeFolder(this.classList[1], southAsia)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          case "sub-saharan-africa":

            closeFolder(this.classList[1], subSaharanAfrica)

            for (var i = 0; i < openFoldersList.length; i++) {
              if (openFoldersList[i] === this.classList[1]) {
                openFoldersList.splice(i, 1);
                break;
              };
            };

            break;

          default:
            console.log("Error in folder minus switch!");

        };
      });

      $(".checkbox-checked, .checkbox-checked-background, .checkbox-unchecked, .checkbox-unchecked-background, .folder-plus, .folder-plus-background, .folder-minus, .folder-minus-background").css("cursor", "pointer")

    };
  };// End of 'Icon Four Menu' function.

  function iconFiveMenu() {
    if (iconFiveOpen) {

      menuSize = 145;

      menu.append("rect")
          .attr("class", "icon-five-item nav-icon-background")
          .attr("width", 24)
          .attr("height", 24)
          .attr("x", 70)
          .attr("y", 24)
          .on("click", function() { window.open("mailto:?&subject=iGraph - Data Visualization&body=Take%20a%20look%20at%20this%20awesome%20data%20visualization%20tool%20made%20by%20Jacob%20Philpott%20with%20D3.js%3A%20i-graph.herokuapp.com"); });

      menu.append("path")
          .attr("class", "icon-five-item icon-five-icon")
          .attr("transform", "translate(66, 20)")
          .attr("d", "M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM8 8h16c0.286 0 0.563 0.061 0.817 0.177l-8.817 10.286-8.817-10.287c0.254-0.116 0.531-0.177 0.817-0.177zM6 22v-12c0-0.042 0.002-0.084 0.004-0.125l5.864 6.842-5.8 5.8c-0.045-0.167-0.069-0.34-0.069-0.517zM24 24h-16c-0.177 0-0.35-0.024-0.517-0.069l5.691-5.691 2.826 3.297 2.826-3.297 5.691 5.691c-0.167 0.045-0.34 0.069-0.517 0.069zM26 22c0 0.177-0.024 0.35-0.069 0.517l-5.8-5.8 5.865-6.842c0.003 0.041 0.004 0.083 0.004 0.125v12z")
          .on("click", function() { window.open("mailto:?&subject=iGraph - Data Visualization&body=Take%20a%20look%20at%20this%20awesome%20data%20visualization%20tool%20made%20by%20Jacob%20Philpott%20with%20D3.js%3A%20i-graph.herokuapp.com"); });

      menu.append("rect")
          .attr("class", "icon-five-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 80)
          .on("click", function() { window.open("https://www.linkedin.com/shareArticle?mini=true&url=https%3A//i-graph.herokuapp.com/&title=iGraph&summary=Take%20a%20look%20at%20this%20awesome%20data%20visualization%20tool%20made%20by%20Jacob%20Philpott%20with%20D3.js!&source=https%3A//www.linkedin.com/in/jgphilpott/"); });

      menu.append("path")
          .attr("class", "icon-five-item icon-five-icon")
          .attr("transform", "translate(66, 80)")
          .attr("d", "M12 11h5.535v2.837h0.079c0.77-1.381 2.655-2.837 5.464-2.837 5.842 0 6.922 3.637 6.922 8.367v9.633h-5.769v-8.54c0-2.037-0.042-4.657-3.001-4.657-3.005 0-3.463 2.218-3.463 4.509v8.688h-5.767v-18M2 11h6v18h-6v-18M8 6c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3z")
          .on("click", function() { window.open("https://www.linkedin.com/shareArticle?mini=true&url=https%3A//i-graph.herokuapp.com/&title=iGraph&summary=Take%20a%20look%20at%20this%20awesome%20data%20visualization%20tool%20made%20by%20Jacob%20Philpott%20with%20D3.js!&source=https%3A//www.linkedin.com/in/jgphilpott/"); });

      menu.append("rect")
          .attr("class", "icon-five-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 140)
          .on("click", function() { window.open("https://twitter.com/home?status=Take%20a%20look%20at%20this%20awesome%20data%20visualization%20tool%20made%20by%20%40Jacob_Philpott%20iGraph%3A%20i-graph.herokuapp.com%20%23D3%20%23D3js%20%23Development"); });

      menu.append("path")
          .attr("class", "icon-five-item icon-five-icon")
          .attr("transform", "translate(66, 140)")
          .attr("d", "M32.003 6.075c-1.175 0.525-2.444 0.875-3.769 1.031 1.356-0.813 2.394-2.1 2.887-3.631-1.269 0.75-2.675 1.3-4.169 1.594-1.2-1.275-2.906-2.069-4.794-2.069-3.625 0-6.563 2.938-6.563 6.563 0 0.512 0.056 1.012 0.169 1.494-5.456-0.275-10.294-2.888-13.531-6.862-0.563 0.969-0.887 2.1-0.887 3.3 0 2.275 1.156 4.287 2.919 5.463-1.075-0.031-2.087-0.331-2.975-0.819 0 0.025 0 0.056 0 0.081 0 3.181 2.263 5.838 5.269 6.437-0.55 0.15-1.131 0.231-1.731 0.231-0.425 0-0.831-0.044-1.237-0.119 0.838 2.606 3.263 4.506 6.131 4.563-2.25 1.762-5.075 2.813-8.156 2.813-0.531 0-1.050-0.031-1.569-0.094 2.913 1.869 6.362 2.95 10.069 2.95 12.075 0 18.681-10.006 18.681-18.681 0-0.287-0.006-0.569-0.019-0.85 1.281-0.919 2.394-2.075 3.275-3.394z")
          .on("click", function() { window.open("https://twitter.com/home?status=Take%20a%20look%20at%20this%20awesome%20data%20visualization%20tool%20made%20by%20%40Jacob_Philpott%20iGraph%3A%20i-graph.herokuapp.com%20%23D3%20%23D3js%20%23Development"); });

      menu.append("rect")
          .attr("class", "icon-five-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 200)
          .on("click", function() { window.open("https://www.facebook.com/sharer/sharer.php?u=https%3A//i-graph.herokuapp.com/"); });

      menu.append("path")
          .attr("class", "icon-five-item icon-five-icon")
          .attr("transform", "translate(66, 200)")
          .attr("d", "M19 6h5v-6h-5c-3.86 0-7 3.14-7 7v3h-4v6h4v16h6v-16h5l1-6h-6v-3c0-0.542 0.458-1 1-1z")
          .on("click", function() { window.open("https://www.facebook.com/sharer/sharer.php?u=https%3A//i-graph.herokuapp.com/"); });

      menu.append("rect")
          .attr("class", "icon-five-item nav-icon-background")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", 66)
          .attr("y", 260)
          .on("click", function() { window.open("https://plus.google.com/share?url=https%3A//i-graph.herokuapp.com/"); });

      menu.append("path")
          .attr("class", "icon-five-item icon-five-icon")
          .attr("transform", "translate(66, 260)")
          .attr("d", "M10.181 14.547v3.494h5.775c-0.231 1.5-1.744 4.394-5.775 4.394-3.475 0-6.313-2.881-6.313-6.431s2.838-6.431 6.313-6.431c1.981 0 3.3 0.844 4.056 1.569l2.762-2.662c-1.775-1.656-4.075-2.662-6.819-2.662-5.631 0.006-10.181 4.556-10.181 10.188s4.55 10.181 10.181 10.181c5.875 0 9.775-4.131 9.775-9.95 0-0.669-0.075-1.181-0.163-1.688h-9.613M32 14.253h-3v-3h-3v3h-3v3h3v3h3v-3h3z")
          .on("click", function() { window.open("https://plus.google.com/share?url=https%3A//i-graph.herokuapp.com/"); });

      $(".icon-five-item").mouseover(function() {
        $(this).css('cursor', 'pointer');
      });

    };
  };

  iconOneMenu();
  iconTwoMenu();
  iconThreeMenu();
  iconFourMenu();
  iconFiveMenu();

  $(".nav-icon, .nav-icon-background, .lock").mouseover(function() {
    $(this).css('cursor', 'pointer');
  });

  $(".menu").mouseover(function() {
    if (menuWidth === 85) {
      $(".globe").css({"fill": colors[0]});
      $(".settings").css({"fill": colors[1]});
      $(".datasets").css({"fill": colors[2]});
      $(".filter").css({"fill": colors[3]});
      $(".share").css({"fill": colors[4]});
    };
  }).mouseout(function() {
    if (menuWidth === 85) {
      $(".globe").css({"fill": "grey"});
      $(".settings").css({"fill": "grey"});
      $(".datasets").css({"fill": "grey"});
      $(".filter").css({"fill": "grey"});
      $(".share").css({"fill": "grey"});
    };
  })

  $(".nav-icon, .nav-icon-background").click(function() {

    switch (this.id) {

      case "home":
        $(".nav-icon").css({"fill": "grey"});
        $(".globe").css({"fill": colors[0]});
        iconOneColor = colors[0];
        iconTwoColor = "grey";
        iconThreeColor = "grey";
        iconFourColor = "grey";
        iconFiveColor = "grey";
        $(".icon-two-item").remove();
        $(".icon-three-item").remove();
        $(".icon-four-item").remove();
        $(".icon-five-item").remove();
        iconOneOpen = true;
        iconTwoOpen = false;
        iconThreeOpen = false;
        iconFourOpen = false;
        iconFiveOpen = false;
        iconOneMenu();
        break;

      case "settings":
        $(".nav-icon").css({"fill": "grey"});
        $(".settings").css({"fill": colors[1]});
        iconOneColor = "grey";
        iconTwoColor = colors[1];
        iconThreeColor = "grey";
        iconFourColor = "grey";
        iconFiveColor = "grey";
        $(".icon-one-item").remove();
        $(".icon-three-item").remove();
        $(".icon-four-item").remove();
        $(".icon-five-item").remove();
        iconOneOpen = false;
        iconTwoOpen = true;
        iconThreeOpen = false;
        iconFourOpen = false;
        iconFiveOpen = false;
        iconTwoMenu();
        break;

      case "datasets":
        $(".nav-icon").css({"fill": "grey"});
        $(".datasets").css({"fill": colors[2]});
        iconOneColor = "grey";
        iconTwoColor = "grey";
        iconThreeColor = colors[2];
        iconFourColor = "grey";
        iconFiveColor = "grey";
        $(".icon-one-item").remove();
        $(".icon-two-item").remove();
        $(".icon-four-item").remove();
        $(".icon-five-item").remove();
        iconOneOpen = false;
        iconTwoOpen = false;
        iconThreeOpen = true;
        iconFourOpen = false;
        iconFiveOpen = false;
        iconThreeMenu();
        break;

      case "filter":
        $(".nav-icon").css({"fill": "grey"});
        $(".filter").css({"fill": colors[3]});
        iconOneColor = "grey";
        iconTwoColor = "grey";
        iconThreeColor = "grey";
        iconFourColor = colors[3];
        iconFiveColor = "grey";
        $(".icon-one-item").remove();
        $(".icon-two-item").remove();
        $(".icon-three-item").remove();
        $(".icon-five-item").remove();
        iconOneOpen = false;
        iconTwoOpen = false;
        iconThreeOpen = false;
        iconFourOpen = true;
        iconFiveOpen = false;
        iconFourMenu();
        break;

      case "share":
        $(".nav-icon").css({"fill": "grey"});
        $(".share").css({"fill": colors[4]});
        iconOneColor = "grey";
        iconTwoColor = "grey";
        iconThreeColor = "grey";
        iconFourColor = "grey";
        iconFiveColor = colors[4];
        $(".icon-one-item").remove();
        $(".icon-two-item").remove();
        $(".icon-three-item").remove();
        $(".icon-four-item").remove();
        iconOneOpen = false;
        iconTwoOpen = false;
        iconThreeOpen = false;
        iconFourOpen = false;
        iconFiveOpen = true;
        iconFiveMenu();
        break;

      default:
        console.log("Error in menu switch!");

    };

    menuOpen = true;

    menuResize = setInterval(openMenu, 100);

  });

  $("body").mousemove(function(event) {
    if (menuOpen === true && event.pageX < graphZoneWidth && locked === false) {

      menuOpen = false;
      clearInterval(menuResize);

      menuResize = setInterval(closeMenu, 100)

    } else if (event.pageX > graphZoneWidth && menuOpen === false && menuWidth !== 85) {

      menuOpen = true;
      clearInterval(menuResize);

      menuResize = setInterval(openMenu, 100)

    };
  });

  $("#unlocked").click(function() {
    $("#unlocked").attr("visibility", "hidden");
    $("#locked").attr("visibility", "visible");
    locked = true;
  });

  $("#locked").click(function() {
    $("#locked").attr("visibility", "hidden");
    $("#unlocked").attr("visibility", "visible");
    locked = false;
  });
};
