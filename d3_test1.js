crashData2 = d3.csv("crashData2.csv");
console.log(0)
crashData2.then(function (data) {

  // crash_data_final = d3.nest()
  //                     .key(function(d) { return d.ZIPCODE; })
  //                     .key(function(d) { return d.Hour > 6 && d.Hour <= 18; })
  //                     .rollup(function(leaves) { return leaves.length; })
  //                     .entries(crashData);

  console.log(1)

  Promise.all([
      d3.json("crash_data_final.json"),
      d3.json("domain_false.json"),
      d3.json("domain_true.json"),
      d3.json('geojson.json')
  ]).then(function(files) {

    crash_data_final = files[0];
    domain_false = files[1];
    domain_true = files[2];
    geojson = files[3];


    console.log(2)
    console.log(domain_true)

    width = 380;
    height = 1000;

    // Projection of Chicago
    projection = d3.geoMercator()
      .scale(width * 90)
      .center([-87.6298, 41.8781])
      .translate([width / 2, height / 2])

    data1 = d3.json("https://raw.githubusercontent.com/michaeltranxd/UIC-Undergraduate-Research-2019-2020/master/HTML/MyWebsite/topojson/chicago_zipcodes.json")
    //console.log(data1)
    //geojson = topojson.feature(data1, data1.objects["Boundaries - ZIP Codes"])
    //geojson = d3.json('geojson.json')
    colorScheme = d3.schemeBlues[8];
    colorScheme_false = d3.schemeReds[8];

    colorScale_false = d3.scaleThreshold()
                          .domain([0, 40, 80, 120, 160, 200, 240, 280])
                          .range(colorScheme_false);

    colorScale_true = d3.scaleThreshold()
                      .domain([0, 70, 140, 210, 280, 350, 420, 490])
                      .range(colorScheme);

                      {
                    const svg = d3.select("#map").selectAll("svg").data(['foo']).enter().append("svg")
                      .attr("width", 300)
                      .attr("height", 500)
                      .attr("class", "topo")

                    svg.append("text")
                         .attr("transform", "translate(70,320)")
                         .attr("x", 50)
                         .attr("y", 50)
                         .attr("font-size", "24px")
                         .text("Day(6am - 6pm)")

                      //svg

                    // // Add group for color legend
                    // var g = svg.append("g")
                    //  .attr("class", "legendThreshold")
                    //  .attr("transform", "translate(" + width * .65 + "," + height / 2 + ")");

                    // g.append("text")
                    //  .attr("class", "caption")
                    //  .attr("x", 0)
                    //  .attr("y", -6)
                    //  .text("Population");
                    // console.log(6)
                    // // Add labels for legend
                    // var labels = ['0', '1-5', '6-10', '11-20'];

                    // Create the legend based on colorScale and our labels
                    // var legend = d3.legendColor()
                    //  //.labels(function (d) { return labels[d.i]; })
                    //  .shapePadding(4)
                    //  .scale(colorScale_false);

                    // svg.append("svg")
                    //   .attr("transform", "translate(500,0)")
                    //    .call(legend);

                    console.log(geojson)

                    //Add the data to the choropleth map
                    svg.selectAll("path")
                      .data(geojson.features)
                      .enter()
                      .append("path")
                      .attr("class", function(d){return "State"})
                      .attr("fill", function(d, i){
                        for (let j = 0; j < 134; j++) {
                          if(domain_false[j][0] == d.properties.zip){
                            //console.log(domain[j][0])
                            //console.log(domain[j][1])
                            return colorScale_false(domain_false[j][1]);
                          }
                        }
                    })
                      .attr("d", d3.geoPath(projection))
                      .on("mouseover", mouseOver )
                      .on("mouseleave", mouseLeave)
                      .on("click", function(d) {
                        //console.log(d.properties)
                        update_rbox(d.srcElement.__data__)
                      })
                      .attr("transform","translate(0,-350)");

                    var svg2 = d3.select("#map").append("svg")
                      .attr("width", 300)
                      .attr("height", 500)
                      .attr("class", "topo1")

                    svg2.append("text")
                         .attr("transform", "translate(50,320)")
                         .attr("x", 50)
                         .attr("y", 50)
                         .attr("font-size", "24px")
                         .text("Night(6pm - 6am)")

                    svg2.selectAll("path")
                      .data(geojson.features)
                      .enter()
                      .append("path")
                      .attr("class", function(d){return "State"})
                      .attr("fill", function(d, i){
                        for (let j = 0; j < 134; j++) {
                          if(domain_true[j][0] == d.properties.zip){
                            //console.log(domain[j][0])
                            //console.log(domain[j][1])
                            return colorScale_true(domain_true[j][1]);
                          }
                        }
                    })
                      .attr("d", d3.geoPath(projection))
                      .on("mouseover", mouseOver )
                      .on("mouseleave", mouseLeave )
                      .on("click", function(d) {
                        console.log(d)
                        update_rbox(d.srcElement.__data__)
                      })
                      .attr("transform","translate(0,-350)");

                    // d3.select("#map").select("svg")
                    // .append("text")
                    //      .attr("transform", "translate(300,380)")
                    //      .attr("x", 50)
                    //      .attr("y", 50)
                    //      .attr("font-size", "24px")
                    //      .text("Day (6am - 6pm)")
                  }



  })




  // domain_false = crash_data_final.map(function(o){
  //     if(o.values[0].key == "false"){
  //         var t_val = o.values[0].value
  //     }
  //     else if(o.values.length > 1 && o.values[1].key == "false"){
  //         var t_val = o.values[1].value
  //     }
  //     else{
  //         var t_val = 0
  //     }
  //     //console.log(1)
  //     return [o.key,t_val]});

  // domain_true = crash_data_final.map(function(o){
  //     if(o.values[0].key == "true"){
  //       var t_val = o.values[0].value
  //     }
  //     else if(o.values.length > 1 && o.values[1].key == "true"){
  //       var t_val = o.values[1].value
  //     }
  //     else{
  //       var t_val = 0
  //     }
  //     //console.log(1)
  //     return [o.key,t_val]});



    // Randomly generate data for choropleth map





});

function update_rbox(data){

  //console.log(data)
  //console.log(crashData)

  crashData = d3.csv("crashData2.csv");
  crashData.then(function (data1) {
    //crashData2 = d3.csv("crashData2.csv");
    //console.log()
    var final_d = data1.filter(function (object) {
              var zip = object.ZIPCODE;
              return zip == parseInt(data.properties.zip);
        });

    var male_val = final_d.filter( d => d.SEX == "M").length
    var fem_val = final_d.filter( d => d.SEX == "F").length

    var male_pct = Number(male_val)/(Number(fem_val)+Number(male_val))
    var fem_pct = Number(fem_val)/(Number(fem_val)+Number(male_val))

    var AgeGroup1 = final_d.filter( d => d.AGE < 40).length
    var AgeGroup2 = final_d.filter( d => d.AGE >= 40).length

    var ag1_pct = Number(AgeGroup1)/(Number(AgeGroup1)+Number(AgeGroup2))
    var ag2_pct = Number(AgeGroup2)/(Number(AgeGroup1)+Number(AgeGroup2))

    //console.log(Male_Val)
    //console.log(Female_Val)
    //console.log(final_d)
    //console.log(final_d.filter( d => d.SEX = "F").length)

    d3.select("#rbox").selectAll("svg")
        .remove()

    var canvas = d3.select("#rbox").append("svg")
            .attr("width", 300)
            .attr("height", 100)

    canvas.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "24px")
            .text(function(d){
                  //console.log(":" + data.properties.NAME)
                  return "ZIPCODE: " + data.properties.zip;
              })
            .attr("transform","translate(0,30)");

    var canvas1 = d3.select("#rbox").append("svg")
            .attr("width", 900)
            .attr("height", 25)


            canvas1.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "12px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "Male: " + Number(male_val);
              })
            .attr("transform","translate(0,0)");

    // d3.select("#rbox").append("svg")
    //         .attr("width", 980)
    //         .attr("height", 500)
    //         .append("text")
    //         .attr("font-size","5em")
    //         .attr("dy", "10em")
    //         .attr("color","black")
    //         .text(function(d){
    //               //console.log("State:" + data.properties.NAME)
    //               return "Male: " + Number(male_val);
    //           })
    //         .attr("transform",
    //         "translate(500,0)");

            canvas1.append("rect")
            .attr("transform",
             "translate(100,0)")
            .transition()
            .attr("width", 150 * male_pct)
            .attr("height", 10)
            .style("fill", "blue");

    var canvas2 = d3.select("#rbox").append("svg")
            .attr("width", 900)
            .attr("height", 25)

    canvas2.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "12px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "Female: " + Number(fem_val);
              })
            .attr("transform","translate(0,0)");


    canvas2.append("rect")
            .attr("transform",
               "translate(100,0)")
            .transition()
            .attr("width", 150 * fem_pct)
            .attr("height", 10)
            .style("fill", "pink");

    var canvas3 = d3.select("#rbox").append("svg")
            .attr("width", 900)
            .attr("height", 25)

    canvas3.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "12px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "Age < 40: " + Number(AgeGroup1);
              })
            .attr("transform","translate(0,0)");

    canvas3.append("rect")
            .attr("transform",
                "translate(100,0)")
            .transition()
            .attr("width", 150 * ag1_pct)
            .attr("height", 10)
            .style("fill", "green");

    var canvas4 = d3.select("#rbox").append("svg")
            .attr("width", 900)
            .attr("height", 25)

    canvas4.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "12px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "Age >= 40: " + Number(AgeGroup2);
              })
            .attr("transform","translate(0,0)");

       canvas4.append("rect")
            .attr("transform",
                "translate(100,0)")
            .transition()
            .attr("width", 150 * ag2_pct)
            .attr("height", 10)
            .style("fill", "orange");

    var canvas4 = d3.select("#rbox").append("svg")
            .attr("width", 900)
            .attr("height", 25)

    canvas4.append("text")
            //.attr("transform", "translate(100,380)")
            .attr("x",10)
            .attr("y", 10)
            .attr("font-size", "12px")
            .text(function(d){
                  //console.log("State:" + data.properties.NAME)
                  return "* bar graph shows data in % point";
              })
            .attr("transform","translate(0,0)");

})

}

// function generate1DRandomDataSet(dataSetSize, minValue, maxValue) {
//   var dataset = []; //Initialize empty array
//   for (var i = 0; i < dataSetSize; i++) {
//     var newNumber = Math.random() * (maxValue - minValue + 1) + minValue;
//     newNumber = Math.floor(newNumber) // Round to nearest integer value
//     dataset.push(newNumber); //Add new number to array
//   }
//   return dataset
// }
//
// // Function mapping generated data to map format
// function mapDataToPopulation(data, dictionaryData){
//   for(const element of data){
//     if(dictionaryData[element] != null){
//       dictionaryData[element] = dictionaryData[element] + 1;
//     }
//   }
//   return dictionaryData
// }

mouseOver = function(d) {
    //console.log(d.toElement.__data__)
    var zip = d.toElement.__data__.properties.zip
    d3.select("#map")
      .selectAll(".State")
      .transition()
      .duration(200)
      .style("opacity", function(d){
        if(d.properties.zip == zip){
          return 1;
        }
        else{
          return 0.2;
        }
      })
    // d3.select(this)
    //   .transition()
    //   .duration(200)
    //   .style("opacity", 1)
      //.style("stroke", "black")
  }

  mouseLeave = function(d) {
    //zip = d.properties.zip)
    d3.select("#map")
      .selectAll(".State")
      .transition()
      .duration(200)
      .style("opacity", function(d){
        //console.log(d)
        return 0.8
      })
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")

      function update_rbox(data){
        console.log(data.properties.zip)

        var final_d = crashData.filter(function (object) {
                  var zip = object.ZIPCODE;
                  return zip == parseInt(data.properties.zip);
            });

        var male_val = final_d.filter( d => d.SEX == "M").length
        var fem_val = final_d.filter( d => d.SEX == "F").length

        var male_pct = Number(male_val)/(Number(fem_val)+Number(male_val))
        var fem_pct = Number(fem_val)/(Number(fem_val)+Number(male_val))

        var AgeGroup1 = final_d.filter( d => d.AGE < 40).length
        var AgeGroup2 = final_d.filter( d => d.AGE >= 40).length

        var ag1_pct = Number(AgeGroup1)/(Number(AgeGroup1)+Number(AgeGroup2))
        var ag2_pct = Number(AgeGroup2)/(Number(AgeGroup1)+Number(AgeGroup2))

        //console.log(Male_Val)
        //console.log(Female_Val)
        //console.log(final_d)
        //console.log(final_d.filter( d => d.SEX = "F").length)

        d3.select("#rbox").selectAll("svg")
            .remove()

        var canvas = d3.select("#rbox").append("svg")
                .attr("width", 300)
                .attr("height", 100)

        canvas.append("text")
                //.attr("transform", "translate(100,380)")
                .attr("x",10)
                .attr("y", 10)
                .attr("font-size", "24px")
                .text(function(d){
                      //console.log(":" + data.properties.NAME)
                      return "ZIPCODE: " + data.properties.zip;
                  })
                .attr("transform","translate(0,30)");

        var canvas1 = d3.select("#rbox").append("svg")
                .attr("width", 900)
                .attr("height", 25)


                canvas1.append("text")
                //.attr("transform", "translate(100,380)")
                .attr("x",10)
                .attr("y", 10)
                .attr("font-size", "12px")
                .text(function(d){
                      //console.log("State:" + data.properties.NAME)
                      return "Male: " + Number(male_val);
                  })
                .attr("transform","translate(0,0)");

        // d3.select("#rbox").append("svg")
        //         .attr("width", 980)
        //         .attr("height", 500)
        //         .append("text")
        //         .attr("font-size","5em")
        //         .attr("dy", "10em")
        //         .attr("color","black")
        //         .text(function(d){
        //               //console.log("State:" + data.properties.NAME)
        //               return "Male: " + Number(male_val);
        //           })
        //         .attr("transform",
        //         "translate(500,0)");

                canvas1.append("rect")
                .attr("transform",
                 "translate(100,0)")
                .transition()
                .attr("width", 150 * male_pct)
                .attr("height", 10)
                .style("fill", "blue");

        var canvas2 = d3.select("#rbox").append("svg")
                .attr("width", 900)
                .attr("height", 25)

        canvas2.append("text")
                //.attr("transform", "translate(100,380)")
                .attr("x",10)
                .attr("y", 10)
                .attr("font-size", "12px")
                .text(function(d){
                      //console.log("State:" + data.properties.NAME)
                      return "Female: " + Number(fem_val);
                  })
                .attr("transform","translate(0,0)");


        canvas2.append("rect")
                .attr("transform",
                   "translate(100,0)")
                .transition()
                .attr("width", 150 * fem_pct)
                .attr("height", 10)
                .style("fill", "pink");

        var canvas3 = d3.select("#rbox").append("svg")
                .attr("width", 900)
                .attr("height", 25)

        canvas3.append("text")
                //.attr("transform", "translate(100,380)")
                .attr("x",10)
                .attr("y", 10)
                .attr("font-size", "12px")
                .text(function(d){
                      //console.log("State:" + data.properties.NAME)
                      return "Age < 40: " + Number(AgeGroup1);
                  })
                .attr("transform","translate(0,0)");

        canvas3.append("rect")
                .attr("transform",
                    "translate(100,0)")
                .transition()
                .attr("width", 150 * ag1_pct)
                .attr("height", 10)
                .style("fill", "green");

        var canvas4 = d3.select("#rbox").append("svg")
                .attr("width", 900)
                .attr("height", 25)

        canvas4.append("text")
                //.attr("transform", "translate(100,380)")
                .attr("x",10)
                .attr("y", 10)
                .attr("font-size", "12px")
                .text(function(d){
                      //console.log("State:" + data.properties.NAME)
                      return "Age >= 40: " + Number(AgeGroup2);
                  })
                .attr("transform","translate(0,0)");

           canvas4.append("rect")
                .attr("transform",
                    "translate(100,0)")
                .transition()
                .attr("width", 150 * ag2_pct)
                .attr("height", 10)
                .style("fill", "orange");

        var canvas4 = d3.select("#rbox").append("svg")
                .attr("width", 900)
                .attr("height", 25)

        canvas4.append("text")
                //.attr("transform", "translate(100,380)")
                .attr("x",10)
                .attr("y", 10)
                .attr("font-size", "12px")
                .text(function(d){
                      //console.log("State:" + data.properties.NAME)
                      return "* bar graph shows data in % point";
                  })
                .attr("transform","translate(0,0)");

            }

}
