 <template>

  <b-container id="c2" class="full-width">
    <b-row>
      <b-col>

        <h1 class="vc2Title">Traffic and Mobility Analysis</h1>


        <i> The maps allow for the visualization of the busiest areas based on movements over the course of a day (2022/03/01) due to
           commuting (home-work and work-home) and restaurant patronage (restaurant-home).</i>
        

          <div class="accordion" role="tablist">
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle.accordion-1 variant="info" class="my-custom-button-class">URBAN MOVEMENT MAPS</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" :visible="false" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
  


                <div class="row justify-content-center">
                <div class="col-md-8">
                  <div class="bottle-btn">
                    <button size="sm" @click="toggleCommuteCircles" class="commuteButton" :class="{ 'selected': commuteSelected }">Commuter</button>
                    <button size="sm" @click="toggleRestaurantCircles" class="restaurantButton" :class="{ 'selected': restaurantSelected }">FromRestaurant</button>
                    </div>
                    <div class="legend" v-if="commuteSelected || restaurantSelected">
                     <ul>
                      <li v-if="commuteSelected"><svg width="20" height="20">
                      <circle cx="10" cy="10" r="5" fill="yellow"></circle>
                      </svg> Employers Location</li>
                      <li v-if="restaurantSelected"><svg width="20" height="20">
                      <circle cx="10" cy="10" r="5" fill="yellow"></circle>
                      </svg> Restaurants Location</li>
                      
                    </ul>
                    </div> 
                  </div>
                </div>
             <div id="BusiestArea"></div> 
             
            </b-card-body>
          </b-collapse>
           </b-card>
        </div>

        <div class="content-wrapper">

            <h1>Spatial Analysis</h1>

            <p class="empty-space"> In the first map, areas with a higher concentration of yellow circles, representing employer locations, 
              suggest that Zones A, B, and D can be considered the busiest, especially where the yellow circles overlap. These are the areas 
              where most commercial and industrial activity likely takes place, which could result in heavier traffic, especially during peak
              hours. Zones E and F appear to have fewer commercial or industrial activities and may represent residential or developing areas.
              These areas might currently not experience congestion points.</p>
            
              <p class="empty-space">The second map displays outgoing movements from restaurants represented by blue circles. A strong presence of blue circles can
              indicate areas with high pedestrian traffic and thriving commercial vitality. Areas with an overlap of yellow and blue circles, 
              such as Zones B and D, may be particularly active and potentially congested in terms of traffic. The lack of significant
              food-related movements in Zones E and F suggests that the movements within these areas are more localized. However, the 
              concentrations of restaurants in Zones B and D suggest that these areas may be focused on entertainment and tourism, which 
              could experience high traffic during evenings and weekends.</p>

              <p class="empty-space">From the correlation between areas with high business density and the location of restaurants, we can see
              that certain zones, A, B, D, and G, have both a strong concentration of workplaces and restaurants. These are likely the busiest 
              areas of the city. Through careful observation, it can be inferred that especially Zones B and D are not only centers of commercial 
              activity but also vibrant social and recreational hubs, resulting in frequent incoming and outgoing movements. Even Zones A and G 
              exhibit a mixed distribution of work activities and restaurants, with frequent transition areas.</p>

      </div>
      


      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getSingleEndpoint } from "@/assets/api_connector";
let Buffer = require('buffer/').Buffer;
const wkx = require('wkx');
const d3 = require('d3');

import { BuildingMap} from "@/assets/BuildingMap_Q2";

const bm = new BuildingMap;


import { BusiestArea } from "@/assets/BusiestArea.js";
  const dm = new BusiestArea();

export default {
  name: "Cluster_map",
  components: {},
  data() {
    return {
      buildings: [],
      commuteSelected: false,
      restaurantSelected: false,
    };
  },
  mounted() {
    
    getSingleEndpoint({}, 'Buildings').then((response) => {
      this.buildings = response.data.map(d => ({
        type: "Feature",
        geometry: wkx.Geometry.parse(Buffer.from(d.location, 'hex')).toGeoJSON(),
        properties: {
          buildingId: d.buildingId,
          buildingType: d.buildingType,
          maxOccupancy: d.maxOccupancy,
          units: d.units,
        },
      }));
        this.drawBusiestArea();
      });     

  },


  methods: {

    drawBuildings() {
      console.log("CLUSTER KID")
      d3.select(this.$refs.map).select('g.buildings')
        .datum(this.buildings)
        .call(bm);   
    },

    drawBusiestArea() {
        d3.select("#BusiestArea")
          .append("svg")
          .attr("width", "100%")
          .attr("height", "700px")
          .append("g")
          .classed("density", true)
          .datum(this.buildings)
          .call(dm);
      },

      toggleCommuteCircles() {
        const commuteCircles = d3.select("#BusiestArea").selectAll(".commute-circle");
        const employersLocCircles = d3.select("#BusiestArea").selectAll(".employersLoc-circle")
        const isHidden = commuteCircles.style("visibility") === "hidden";

        if (!isHidden) {
          return; 
        }

        const restaurantCircles = d3.select("#BusiestArea").selectAll(".restaurant-circle");
        restaurantCircles.style("visibility", "hidden");
        this.restaurantSelected = false;

        commuteCircles.style("visibility", "visible");
        employersLocCircles.style("visibility", "visible")
        this.commuteSelected = true;
      },

      toggleRestaurantCircles() {
        const restaurantCircles = d3.select("#BusiestArea").selectAll(".restaurant-circle");
        const restaurantLocCircles = d3.select("#BusiestArea").selectAll(".restaurantLoc-circle")
        const isHidden = restaurantCircles.style("visibility") === "hidden";

        if (!isHidden) {
          return; 
        }

        const commuteCircles = d3.select("#BusiestArea").selectAll(".commute-circle");
        const employersLocCircles = d3.select("#BusiestArea").selectAll(".employersLoc-circle")
        commuteCircles.style("visibility", "hidden");
        employersLocCircles.style("visibility", "hidden")
        this.commuteSelected = false;

        restaurantCircles.style("visibility", "visible");
        restaurantLocCircles.style("visibility", "visible")
        this.restaurantSelected = true;
      },
  },
};


</script>

<style scoped>

.full-width {
  width: 100%;
}

#c2 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;  
}


#BusiestArea svg {
  width: 100%;
}

.bottle-btn {
    position: absolute;
    top: 10px;
    right: 30px;
  }

  button.commuteButton,
  button.restaurantButton {
    margin-left: 10px;
    background-color: transparent;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    transition: background-color 0.3s ease, opacity 0.3s ease;
    opacity: 0.3;
    color: white;
  }

  button.commuteButton,
  button.restaurantButton {
    color: white;
  }

  button.commuteButton {
    background-color: red;
  }

  button.restaurantButton {
    background-color: #0079FF;
  }

  button.commuteButton,
  button.restaurantButton {
    opacity: 0.3;
    color: white;
    transition: opacity 0.3s ease;
  }

  button.commuteButton.selected,
  button.restaurantButton.selected {
    opacity: 1;
  }

  legend ul {
  list-style-type: none;
  padding: 0;
}

.legend{
  position: absolute;
  right: 10px;
  bottom: -150px; 
  background-color: white; 
  padding: 10px;
  border-radius: 5px;
}


.legend li {
  display: flex;
  align-items: center;
  color: black; 
}

.legend li span {
  display: inline-block;
  width: 20px;
  height: 10px;
  margin-left: 5px;
}

</style>@/assets/BuildingMap_Q2@/assets/BusiestArea.js