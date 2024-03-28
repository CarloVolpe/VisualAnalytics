const d3 = require("d3");

function BuildingMap(){
    
    let extent;

    function me(selection){


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
            .attr("fill","#7d34ad")
            .attr("opacity", 0.8)

            

    }

    

    me.extent = function (){
        return extent
    };

    return me;
}





export {BuildingMap}
