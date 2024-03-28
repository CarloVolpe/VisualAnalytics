import * as d3 from 'd3';

function BusiestArea() {
  const color = "#CCCCCC"; 
  let extent;
  

  function me(selection) {
    const data = selection.datum(); 

    extent = {
      type: "GeometryCollection",
      geometries: data.map((d) => d.geometry),
    };

    const projection = d3.geoIdentity().reflectY(true).fitSize([650, 650], extent);

    const path = d3.geoPath().projection(projection);

    selection
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("d", path)
      .attr("fill", color)
      .attr("stroke", "grey")
      .attr("stroke-width", 0.5);
      
      selection
            .append("text")
            .attr("x", 40)
            .attr("y", 160)
            .text("A")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

        selection
            .append("text")
            .attr("x", 280)
            .attr("y", 280)
            .text("B")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

        selection
            .append("text")
            .attr("x", 390)
            .attr("y", 280)
            .text("C")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

        selection
            .append("text")
            .attr("x", 580)
            .attr("y", 280)
            .text("D")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

        selection
            .append("text")
            .attr("x", 280)
            .attr("y", 430)
            .text("E")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

        selection
            .append("text")
            .attr("x", 330)
            .attr("y", 630)
            .text("F")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

        selection
            .append("text")
            .attr("x", 530)
            .attr("y", 630)
            .text("G")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#FF8C00");

      
      

    d3.csv("traffic_commute.csv").then((CommuteData) => {
      const parsedCommuteData = CommuteData.map((d) => {
        const coordinates = d.currentLocation
          .replace("POINT (", "")
          .replace(")", "")
          .split(" ");


        return {
          geometry: {
            type: "Point",
            coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
          },
          occorrenze: parseInt(d.occorrenze),
        };
      });

      selection
        .selectAll(".commute-circle")
        .data(parsedCommuteData)
        .join("circle")
        .attr("class", "commute-circle")
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1])
        .attr("r", (d) => d.occorrenze * 0.09)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("visibility", "hidden");
    });

    d3.csv("traffic_restaurant.csv").then((RestaurantData) => {
      const parsedRestaurantData = RestaurantData.map((d) => {
        const coordinates = d.currentLocation
          .replace("POINT (", "")
          .replace(")", "")
          .split(" ");

        return {
          geometry: {
            type: "Point",
            coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
          },
          occorrenze: parseInt(d.occorrenze),
        };
      });

      selection
        .selectAll(".restaurant-circle")
        .data(parsedRestaurantData)
        .join("circle")
        .attr("class", "restaurant-circle")
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1])
        .attr("r", (d) => d.occorrenze * 0.09)
        .attr("fill", "#0079FF")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("visibility", "hidden");
    });

    d3.csv("Restaurants.csv").then((RestaurantLocation) =>{
      const parsedRestaurantLocation = RestaurantLocation.map((d) => {
        const coordinates = d.location
          .replace("POINT (", "")
          .replace(")", "")
          .split(" ");

          return {
            geometry: {
              type: "Point",
              coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
            },
          };
    });

    selection
        .selectAll(".restaurantLoc-circle")
        .data(parsedRestaurantLocation)
        .join("circle")
        .attr("class", "restaurantLoc-circle")
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1])
        .attr("r", 4)
        .attr("fill", "yellow")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("visibility", "hidden");

  });


  d3.csv("Employers.csv").then((EmployersLocation) =>{
    const parsedEmployersLocation = EmployersLocation.map((d) => {
      const coordinates = d.location
        .replace("POINT (", "")
        .replace(")", "")
        .split(" ");

        return {
          geometry: {
            type: "Point",
            coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
          },
        };
  });

  selection
      .selectAll(".employersLoc-circle")
      .data(parsedEmployersLocation)
      .join("circle")
      .attr("class", "employersLoc-circle")
      .attr("cx", (d) => projection(d.geometry.coordinates)[0])
      .attr("cy", (d) => projection(d.geometry.coordinates)[1])
      .attr("r", 3)
      .attr("fill", "yellow")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("visibility", "hidden");

});


  
}

  me.color = function () {
    return color;
  };

  me.extent = function () {
    return extent;
  };

  return me;
}

export { BusiestArea };