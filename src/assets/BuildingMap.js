const d3 = require("d3");

function BuildingMap(){
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    let extent;

    function me(selection){

       console.log("stampa3") 
        const buildingTypes = d3
        .groups(selection.datum()
        .map(d => d.properties.buildingType), d=>d)
        .map(d => d[0]);

        console.log("buildingTypes", buildingTypes);
        color.domain(buildingTypes);

        extent = {
            type: "GeometryCollection",
            geometries: selection.datum().map(d => d.geometry)
        };

        const projection = d3.geoIdentity().reflectY(true).fitSize([700, 700], extent);
        const path = d3.geoPath().projection(projection);

        selection.selectAll("path")
            .data(selection.datum())
            .join("path")
            .attr("d", path)
            .attr("fill", d => {if (d.properties.buildingType === "School") {return d3.color('#800080').brighter(1.5).toString();}
            else { return color(d.properties.buildingType)}})
            .attr("opacity", d => {if (d.properties.buildingType === "School") {
                    return 1;} else {return 0.8;}})

        selection
            .append("text")
            .attr("x", 40)
            .attr("y", 160)
            .text("A")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

        selection
            .append("text")
            .attr("x", 280)
            .attr("y", 280)
            .text("B")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

        selection
            .append("text")
            .attr("x", 390)
            .attr("y", 280)
            .text("C")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

        selection
            .append("text")
            .attr("x", 580)
            .attr("y", 280)
            .text("D")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

        selection
            .append("text")
            .attr("x", 280)
            .attr("y", 430)
            .text("E")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

        selection
            .append("text")
            .attr("x", 330)
            .attr("y", 630)
            .text("F")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

        selection
            .append("text")
            .attr("x", 530)
            .attr("y", 630)
            .text("G")
            .style("font-size", "34px")
            .style("font-weight", "bold")
            .style("fill", "#117A65");

    }

    console.log("PRE COLOR")
    me.color = function(){
        return color;
    }
    console.log("PRE EXTENT")
    me.extent = function (){
        return extent
    };

    return me;
}

function BuildingTypeLegend(){
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    function me(selection){
        const color_2 = {
            "Apartments" : "Black",
            "Restaurants" : "#f76262",
            "Pubs" : "#5e88fc",
            "School" : "#800080"
        };

        const legend = selection.append("g")
            .attr("transform", "translate(500, 20)");

        const legendItem = legend.selectAll("g")
            .data(color.domain())//.concat(["Apartments","Restaurants","Pubs"]))
            .join("g")
            .attr("transform", (d, i) => `translate(0, ${i*20})`);


        legendItem.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill-opacity", 0.2)//d => (d === "Apartments" || d ==="Restaurants" || d === "Pubs") ? 0 : 0.2) // Imposta l'opacità a 1 solo per i cerchi
            .attr("fill", d =>(d === "School") ? color_2[d] : color(d));


        legendItem.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text(d => d);
    }

    me.color = function(_){
        if (!arguments.length) return color;
        color = _;
        return me;
    };


    return me;
}


// APARTMENT
function BuildingApt() {
    function me(selection, extent) {
        const apartmentIds = d3
            .groups(selection.datum().map(d => d.properties.apartmentId), d => d)
            .map(d => d[0]);

        console.log("apartmentIds", apartmentIds);

        const projection = d3
            .geoIdentity()
            .reflectY(true)
            .fitSize([700, 700], extent);

        selection
            .selectAll(".apt")
            .data(selection.datum())
            .join("circle")
            .attr("class", "apt")
            .attr("cx", d => projection(d.geometry.coordinates)[0])
            .attr("cy", d => projection(d.geometry.coordinates)[1])
            .attr("r", 1.2);
    }

    return me;
}

// P U B S
function BuildingPub() {
    const color = '#00008B';

    function me(selection, extent) {
        const pubIds = d3
            .groups(selection.datum().map(d => d.properties.pubId), d => d)
            .map(d => d[0]);

        console.log("pubIds", pubIds);

        const projection = d3
            .geoIdentity()
            .reflectY(true)
            .fitSize([700, 700], extent);

        selection
            .selectAll(".pub")
            .data(selection.datum())
            .join("circle")
            .attr("class", "pub")
            .attr("cx", d => projection(d.geometry.coordinates)[0])
            .attr("cy", d => projection(d.geometry.coordinates)[1])
            .attr("r", 4.5)
            .attr("fill", color)
            .attr("fill-opacity", 1);
    }

    return me;
}


// R E S T A U R A N T S
function BuildingRestaurant() {
    const color = '#9E1A1A';

    function me(selection, extent) {
        const restaurantId = d3
            .groups(selection.datum().map(d => d.properties.restaurantId), d => d)
            .map(d => d[0]);

        console.log("restaurantId", restaurantId);

        const projection = d3
            .geoIdentity()
            .reflectY(true)
            .fitSize([700, 700], extent);

        selection
            .selectAll(".restaurant")
            .data(selection.datum())
            .join("circle")
            .attr("class", "restaurant")
            .attr("cx", d => projection(d.geometry.coordinates)[0])
            .attr("cy", d => projection(d.geometry.coordinates)[1])
            .attr("r", 4.5)
            .attr("fill", color)
            .attr("fill-opacity", 1);
    }

    return me;
}


export {
    BuildingMap,
    BuildingTypeLegend,
    BuildingRestaurant,
    BuildingPub,
    BuildingApt
}




