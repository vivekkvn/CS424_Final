//crashData = d3.csv("crashData4.csv");
//y22 = d3.csv("y22.csv");

Promise.all([
    d3.csv("crashData4.csv"),
    d3.csv("y22.csv"),
]).then(function(files) {

  crashData = files[0]
  y22 = files[1]

  margin = ({top: 10, right: 150, bottom: 50, left: 105});
  visWidth = window.innerWidth - margin.left - margin.right;
  visHeight = visWidth/1.6;

  subgroups = ["DEPLOYED, COMBINATION", "DEPLOYMENT UNKNOWN", "DID NOT DEPLOY", "DEPLOYED, FRONT","NOT APPLICABLE","DEPLOYED, SIDE",  "DEPLOYED OTHER (KNEE, AIR, BELT, ETC.)"]
  groups = [1,2,3,4,5,6,7,8,9,10,11,12]

  x = d3.scaleBand()
        .domain([1,2,3,4,5,6,7,8,9,10,11,12])
        .range([0, visWidth])
        .padding([0.2])

  //Y-axis
  y = d3.scaleLinear()
            .domain([0, 2000])
            .range([ visHeight, 0 ]);

  //Color Scale
  color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"])



  stackedPlot()


  function getKeyByValue(object, value) {
    console.log(object)
    console.log(Object.keys(object).find(key => object[key] == value))
    return Object.keys(object).find(key => object[key] == value);
  }

  function stackedPlot() {

    const svg = d3.select('#map1').append('svg')
        .attr('width', visWidth + margin.left + margin.right + 700)
        .attr('height', visHeight + margin.top + margin.bottom + 100);

    const xdata = [0,1,2,3,4,5,6,7,8,9,10,11,12];

  //axis labels
    svg.append("text")
         .attr("transform", "translate(210,-25)")
         .attr("x", 50)
         .attr("y", 50)
         .attr("font-size", "18px")
         .text("Crashes Vs Month Vs AIRBAG_DEPLOYED")

    svg.append("text")
         .attr("transform", "translate(350," + visHeight + ")")
         .attr("x", 50)
         .attr("y", 50)
         .attr("font-size", "17px")
         .text("Months")

    svg.append("text")
         .attr("transform", "translate(-50,155)")
         // .attr("translate", "rotate(-90)")
         .attr("x", 50)
         .attr("y", 50)
         .attr("font-size", "17px")
         .text("Crashes")


    //Legend

    svg.append("circle").attr("cx",600).attr("cy",50).attr("r", 6).style("fill", "#7fc97f")
    svg.append("circle").attr("cx",600).attr("cy",80).attr("r", 6).style("fill", "#beaed4")
    svg.append("circle").attr("cx",600).attr("cy",110).attr("r", 6).style("fill", "#fdc086")
    svg.append("circle").attr("cx",600).attr("cy",140).attr("r", 6).style("fill", "#ffff99")
    svg.append("circle").attr("cx",600).attr("cy",170).attr("r", 6).style("fill", "#386cb0")
    svg.append("circle").attr("cx",600).attr("cy",200).attr("r", 6).style("fill", "#f0027f")
    svg.append("text").attr("x", 620).attr("y", 50).text("DEPLOYED, COMBINATION").style("font-size", "11px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 620).attr("y", 80).text("DEPLOYMENT UNKNOWN").style("font-size", "11px")
      .attr("alignment-baseline","middle")
  svg.append("text").attr("x", 620).attr("y", 110).text("DID NOT DEPLOY").style("font-size", "11px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 620).attr("y", 140).text("DEPLOYED, FRONT").style("font-size", "11px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 620).attr("y", 170).text("NOT APPLICABLE").style("font-size", "11px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 620).attr("y", 200).text("DEPLOYED, SIDE").style("font-size", "11px").attr("alignment-baseline","middle")

    //Svg
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // axes

      g.append("g")
           .call(d3.axisLeft(y).tickFormat(function(d){
               return d;
           })
           .ticks(10))
           .append("text")

      g.append("g")
           .attr("transform", "translate(0," + visHeight + ")")
           .call(d3.axisBottom(x).tickFormat(function(d){
               return xdata[d];
           })
            .ticks(12))
           .append("text")


    //const subgroups = ["DARKNESS","DARKNESS,LIGHTED ROADS","UNKNOWN","DUSK","DAWN","DAYLIGHT"]
    const subgroups = ["DEPLOYED, COMBINATION", "DEPLOYMENT UNKNOWN", "DID NOT DEPLOY", "DEPLOYED, FRONT","NOT APPLICABLE","DEPLOYED, SIDE",  "DEPLOYED OTHER (KNEE, AIR, BELT, ETC.)"]

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    //const groups = ["0","1","2","3"]
    const groups = ["1","2","3","4","5","6","7","8","9","10","11","12"]

    //stack the data? --> stack per subgroup
    stack_obj = d3.stack()
                  .keys(subgroups)

    console.log(y22.PromiseResult)
    const stackedData = stack_obj(y22)
    // console.log(stackedData)

    // Show the bars
    g.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter().append("g")
        .attr("fill", function(d) {
          // console.log(d.key)
          return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) {
          return d; })
        .enter().append("rect")
          .attr("x", function(d) {
            // console.log(d.data.Season)
            return x((d.data.Month)) -25 ; })
          .attr("y", function(d) { console.log(y(d[1]))
                                  console.log(d)
            return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width",40)
          .on("click", function(d) {
          diff =  d.target.__data__[1] - d.target.__data__[0]
          k = getKeyByValue(d.target.__data__.data,diff)
          console.log(diff)
          console.log(d.target.__data__.data.Month)
          update_rbox(d.target.__data__.data, k)
        })
          .attr("transform", "translate(38,0.2)")

  }

  function update_rbox(data, k){
    console.log(k)

    var final_m = crashData.filter(d => d.Month == data.Month);
    var final_d = final_m.filter(d => d.AIRBAG_DEPLOYED == k);

    console.log(final_d)

    var male_val = final_d.filter( d => d.SEX == "M").length
    var fem_val = final_d.filter( d => d.SEX == "F").length

    var male_pct = Number(male_val)/(Number(fem_val)+Number(male_val))
    var fem_pct = Number(fem_val)/(Number(fem_val)+Number(male_val))

    console.log(male_val)
    d3.select("#rbox").selectAll("svg")
        .remove()

    var canvas = d3.select("#rbox").append("svg")
            .attr("width", window.innerWidth - window.innerWidth/5)
            .attr("height", 75)

    canvas.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "24px")
            .text(function(d){
                  //console.log(":" + data.properties.NAME)
                  return "Air Bag classification : "+ k + ", Month: " + data.Month;
              })
            .attr("transform","translate(0,30)");

    var canvas1 = d3.select("#rbox").append("svg")
            .attr("width", window.innerWidth - window.innerWidth/5)
            .attr("height", 50)


    canvas1.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "24px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "Male: " + Number(male_val);
              })
            .attr("transform","translate(0,10)");

            canvas1.append("rect")
            .attr("transform",
             "translate(150,0)")
            .transition()
            .attr("width", 2 * Number(male_val))
            .attr("height", 20)
            .style("fill", "blue");

    var canvas2 = d3.select("#rbox").append("svg")
            .attr("width", 900)
            .attr("height", 55)

    canvas2.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "24px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "Female: " + Number(fem_val);
              })
            .attr("transform","translate(0,10)");


    canvas2.append("rect")
            .attr("transform",
               "translate(150,0)")
            .transition()
            .attr("width", 2 * Number(fem_val))
            .attr("height", 20)
            .style("fill", "pink");

  }


})
