crashData = d3.csv("crashData.csv");
crashData1 = d3.csv("crashData1.csv");

crashData.then(function (data) {

  margin = ({top: 10, right: 20, bottom: 50, left: 105});
  visWidth = window.innerWidth/2;
  visHeight = visWidth / 1.6;

  Grp_Month =  d3.group(data,d => d.Month)
  Grp_Age = d3.rollup(data, v => d3.mean(v, d => d.AGE), d => d.Hour )
  Grp_Age1 = Array.from(Grp_Age)
  Grp_Age2 = Grp_Age1.sort(function(a, b){ return d3.ascending(a[0], b[0]); })

  xscale = d3.scaleLinear()
      .domain([0,23])
      .range([0, visWidth])

  yscale = d3.scaleLinear()
          .domain([0,45])
          .range([visHeight, 0])

  barplot()
});

crashData1.then(function (data) {

  data1_1 = d3.rollup(data, v => v.length, d=> d.Hour, d => d.SEX)
  data1_2 = d3.rollup(data, v => v.length, d=> d.Hour, d => d.SEX, d => d.PERSON_TYPE)

  margin = ({top: 20, right: 20, bottom: 30, left: 50})
  width = window.innerWidth/2 - margin.left - margin.right
  height = window.innerWidth/4 - margin.top - margin.bottom

  x = d3.scaleLinear().range([0,width])
  y = d3.scaleLinear().range([height, 0])

  valueline1 = d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1].get('F')); })

  valueline2 = d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1].get('M')); });

  allGroup = ["Total Crashes", "Only Driver", "Only Passenger"]

  d3.select("#option")
      .select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

  d3.select("#selectButton").on("change", function(d) {
       d3.select("#line").selectAll("svg")
                         .remove()
       //console.log("ABC")
       var selectedOption = d3.select(this).property("value")
       // run the updateChart function with this selected option
       if(selectedOption == "Total Crashes"){
           val1(data1_1)
       }
       else if(selectedOption == "Only Driver"){
         val2(data1_2, 2)
       }
       else if(selectedOption == "Only Passenger"){
         val2(data1_2, 5)
       }
   })

   val1(data1_1)

});



// crashData = crash_data.map(d => ({
//   PERSON_ID: d['PERSON_ID'],
//   PERSON_TYPE: d['PERSON_TYPE'],
//   CRASH_DATE: d['CRASH_DATE'],
//   CITY: d['CITY'],
//   SEX: d['SEX'],
//   AGE: d['AGE'],
//   AIRBAG_DEPLOYED: d['AIRBAG_DEPLOYED'],
//   INJURY_CLASSIFICATION: d['INJURY_CLASSIFICATION'],
//   HOSPITAL: d['HOSPITAL'],
//   DRIVER_ACTION: d['DRIVER_ACTION'],
//   Hour: d['Hour'],
//   Day: d['Day'],
//   WeekDay: d['WeekDay'],
//   Month: d['Month']
// })).filter(d => d.CITY == "CHICAGO" && d.AGE !== null && d.HOSPITAL !== null && d.DRIVER_ACTION !== null && d.AIRBAG_DEPLOYED !== null);



function barplot() {
    // set up
    const svg = d3.select('#my_dataviz1')
              .append('svg')
              .attr('width', visWidth + margin.left + margin.right )
              .attr('height', visHeight + margin.top + margin.bottom );

    svg.append("text")
               .attr("transform", "translate(100,0)")
               .attr("x", 50)
               .attr("y", 50)
               .attr("font-size", "24px")
               .text("Age v/s Hour")

          // svg.append("text")
          //      .attr("transform", "translate(500,400)")
          //      .attr("x", 50)
          //      .attr("y", 50)
          //      .attr("font-size", "16px")
          //      .text("Hour")


    const g = svg.append('g')
              .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // axes
    //g.append("g").call(xAxis, x, 'horsehpower');
    g.append("g")
       .call(d3.axisLeft(yscale).tickFormat(function(d){
          return d;
        })
        .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Average Age")
                  //.attr("transform", "translate(-25,0)");

    g.append("g")
         .attr("transform", "translate(12," + visHeight + ")")
         .call(d3.axisBottom(xscale)
         .ticks(24))
         .append("text")
                 //.attr("y", height - 250)
                 //.attr("x", width - 100)
         .attr("text-anchor", "start")
         .attr("stroke", "black")
         .text("Hour of the Day")
         .attr("transform", "translate(350,25)");

          // draw points
    g.selectAll('rect')
            // filter data to only contain selected car origins
          .data(Grp_Age2)
          .join('rect')
          .attr("class", "bar")
          .attr("x", function(d,i) { return xscale(i); })
          .attr("y", function(d) { return yscale(d[1]) })
          .attr("width", 20)
          .attr("height", function(d,i) { console.log(d[1]);
            return visHeight - yscale(d[1]); })
          .style("fill", "LightBlue");

    return svg.node();
}


val1 = function(data) {

  margin = ({top: 20, right: 20, bottom: 30, left: 50})
  width = window.innerWidth/2 - margin.left - margin.right
  height = window.innerWidth/4 - margin.top - margin.bottom

  console.log(data)

  var svg = d3.select("#line").append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

  var SVG = d3.select("#line").select('svg')

  // create a list of keys
  var keys = ["Male", "Female"]

  // Usually you have a color scale in your chart already
  var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["Blue","Red"]);

  // Add one dot in the legend for each name.
  var size = 20
  SVG.selectAll("mydots")
  .data(keys)
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return color(d)})

  // Add one dot in the legend for each name.
  SVG.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  // format the data
  // data.forEach(function(d) {
  //     d.Hour = d.Hour;
  //     d.Male = d.Male;
  //     d.Female = d.Female;
  // });

  // Scale the range of the data
  x.domain([0,23]);
  y.domain([0, d3.max(data, function(d) {
    console.log(d[1].get('M'))
	  return Math.max(d[1].get('M'), d[1].get('F')); })]);

  svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Hours Vs Total Crashes")

  svg.append("text")
       .attr("transform", "translate(350,430)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "16px")
       .text("Hour of the Day")

  svg.append("text")
       .attr("transform", "translate(-100,-55)")
      //.attr("transform", "rotate(-90)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "16px")
       .text("Number of Crashes")

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .style("fill", "none")
      .attr("d", valueline1);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .style("fill", "none")
      .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(24));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

}

val2 = function(data,i) {

  margin = ({top: 20, right: 20, bottom: 30, left: 50})
  width = window.innerWidth - margin.left - margin.right
  height = window.innerWidth/4 - margin.top - margin.bottom

  console.log(data)
  console.log(i)

  i = i.toString()


  // format the data
  // data.forEach(function(d) {
  //     d.Hour = d.Hour;
  //     d.Male = d.Male;
  //     d.Female = d.Female;
  // });

  var svg = d3.select("#line").append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

    var SVG = d3.select("#line").select('svg')

  // create a list of keys
  var keys = ["Male", "Female"]

  // Usually you have a color scale in your chart already
  var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["Blue","Red"]);

  // Add one dot in the legend for each name.
  var size = 20
  SVG.selectAll("mydots")
  .data(keys)
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return color(d)})

  // Add one dot in the legend for each name.
  SVG.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  // Scale the range of the data
  x.domain([0,23]);
  y.domain([0, d3.max(data, function(d) {
    //console.log(d[1].get('M').get(i))
    //console.log(i)
	  return Math.max(d[1].get('M').get(i), d[1].get('F').get(i)); })]);

  svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Hours Vs Total Crashes")

  svg.append("text")
       .attr("transform", "translate(350,430)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "16px")
       .text("Hour of the Day")

  svg.append("text")
       .attr("transform", "translate(-100,-55)")
      //.attr("transform", "rotate(-90)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "16px")
       .text("Number of Crashes")

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .style("fill", "none")
      .attr("d", d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1].get('F').get(i)); }));

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .style("fill", "none")
      .attr("d", d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1].get('M').get(i)); }));

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(24));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

}
