
const d3 = require("d3");


function BuildingMap2() {
    
    let extent;

    function me(selection) {
        console.log("stampa3");
        

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
            .attr("fill", '#CCCCCC')
            .attr("opacity", 0.8);

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

    
    me.extent = function() {
        return extent;
    };

    return me;
}




module.exports = {
    BuildingMap2
};
