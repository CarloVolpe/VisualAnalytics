<template>

    <b-container id="vc2" class= "vc2-container" style="max-width: 24000px;">
      
        <b-col cols="12">          
  
            <h1 class="vc2Title">Urban Engagement Analysis</h1>

            <i> This report presents an analytical overview of the urban layout as depicted by the Engagement Map of the city. The map is a comprehensive graphical representation that encapsulates the 
              distribution of various types of establishments and residential zones, delineating the city’s functional and social structure.
              These observations not only reflect current urban planning strategies but also shed light on potential areas for future development, 
              demographic trends, and the social dynamics of the city.</i>  
  
            
            <div class="accordion" role="tablist">
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle.accordion-1 variant="info" class="my-custom-button-class">URBAN ENGAGEMENT MAP</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" :visible="false" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
  
  
                    <div class="row justify-content-center">
                      <div class="col-md-8">
                        <div class="button-container">
                          <button :class="{ active: pubsActive }" @click="togglePubs" class="pubsButton">Pubs</button>
                          <button :class="{ active: restaurantsActive }" @click="toggleRestaurants" class="restButton">Restaurants</button>
                          <button :class="{ active: apartmentsActive }" @click="toggleApartments" class="aparButton">Apartments</button>
                        </div>
                      </div>
                    </div>
  
                    <svg width="100%" height="700px" ref="mapUnique3">
                      <g class="buildings"></g>
                      <g class="legend"></g>
                      <g class="apartments" :opacity="apartmentsActive ? 1 : 0"></g>
                      <g class="pubs" :opacity="pubsActive ? 1 : 0"></g>
                      <g class="restaurants" :opacity="restaurantsActive ? 1 : 0"></g>
  
                    </svg>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>

            <div class="content-wrapper">

              <h1>Spatial Analysis</h1>

              <p class="empty-space"> The city features extensive undeveloped areas. The distinction between residential (orange) and commercial (blue) buildings 
                helps to differentiate the zones. The distribution reflects a clear pattern of functional separation between commercial, 
                residential, and educational activities. The outskirts are characterized by a predominance of residential zones and educational 
                institutions. A considerable extension of commercial areas is located in strategic positions, which seem aimed at maximizing their
                accessibility to residents. As we can observe, Area B and Area C primarily serve commercial functions in the downtown, while
                areas E and F are predominantly residential. Areas A, D, and G, on the other hand, are mixed but with more residential
                zones towards their outer edges. We note that Area B has various dining establishments, which seem to mainly support 
                the commercial activity there. A concentration of pubs and restaurants is visible in specific nodes, indicating 
                the possible existence of districts meant for entertainment and tourism, or possibly zones under development.
                Of interest is the border zone between Areas B and E, which shows a concentration of mixed functions - apartments,
                commercial activities, pubs, and restaurants - which could represent a challenge for the transportation infrastructure.</p>
              </div>  
  
        </b-col>    
    </b-container>  
  </template>
  
   
  
  <script>
  import { getSingleEndpoint} from "@/assets/api_connector";
  
  
  let Buffer = require('buffer/').Buffer;
  const wkx = require('wkx');
  const d3 = require('d3');
  
  import {BuildingMap, BuildingPub,BuildingApt,BuildingRestaurant,BuildingTypeLegend} from "@/assets/BuildingMap";
  
  const bm = new BuildingMap();
  const bl = new BuildingTypeLegend();
  const bp = new BuildingPub();
  const ba = new BuildingApt();
  const br = new BuildingRestaurant()
  
  export default {
    name: 'Challenge_2',
    components: {
    },
    data(){
      return {
        buildings: [],
        pubs: [],
        apartments: [],
        restaurants: [],
  
        pubsActive: false,
        restaurantsActive: false,
        apartmentsActive: false
      }
    },
    mounted(){
  
      // MAP
  
      getSingleEndpoint({}, 'Buildings').then((response) => {
        this.buildings = response.data.map(d => ({
          type: "Feature",
          geometry: wkx.Geometry.parse(Buffer.from(d.location, 'hex')).toGeoJSON(),
          properties:{
            buildingId: d.buildingId,
            buildingType: d.buildingType,
            maxOccupancy: d.maxOccupancy,
            units: d.units,
          },
        }));
  
        // PUBS
        getSingleEndpoint({}, "Pubs").then((response) => {
          this.pubs = response.data.map((d) => ({
            type: "Feature",
            geometry: wkx.Geometry.parse(Buffer.from(d.location, "hex")).toGeoJSON(),
            properties: {
              pubId: d.pubId,
              hourlyCost: d.hourlyCost,
              maxOccupancy: d.maxOccupancy,
              buildingId: d.buildingId,
            },
          }));
          this.drawPub();
        });
  
        // DRAW APARTMENTS
        getSingleEndpoint({}, "Apartments").then((response) => {
          this.apartments = response.data.map((d) => ({
            type: "Feature",
            geometry: wkx.Geometry.parse(Buffer.from(d.location, "hex")).toGeoJSON(),
            properties: {
              numberOfRooms: d.numberOfRooms,
              apartmentId: d.apartmentId,
              buildingId: d.buildingId,
              rentalCost: d.rentalCost,
              maxOccupancy: d.maxOccupancy,
            },
          }));
          this.drawApt();
        });
  
        // DRAW RESTAURANTS
        getSingleEndpoint({}, "Restaurants").then((response) => {
          this.restaurants = response.data.map((d) => ({
            type: "Feature",
            geometry: wkx.Geometry.parse(Buffer.from(d.location, "hex")).toGeoJSON(),
            properties: {
              restaurantId: d.restaurantId,
              maxOccupancy: d.maxOccupancy,
              foodCost: d.foodCost,
              buildingId: d.buildingId,
            },
          }));
          this.drawRestaurants();
        });
        this.drawBuildings();
  
      });
    },
    methods:{
  
      drawBuildings(){
        d3.select(this.$refs.mapUnique3).select('g.buildings')
            .datum(this.buildings)
            .call(bm);
  
  
  
        bl.color(bm.color());
  
        d3.select(this.$refs.mapUnique3).select('g.legend')
            .call(bl);
      },
  
      drawPub() {
        d3.select(this.$refs.mapUnique3).select('g.pubs').datum(this.pubs).call(bp, bm.extent());
      },
  
      drawApt() {
        d3.select(this.$refs.mapUnique3).select('g.apartments').datum(this.apartments).call(ba, bm.extent());
      },
  
      drawRestaurants() {
        d3.select(this.$refs.mapUnique3).select('g.restaurants').datum(this.restaurants).call(br, bm.extent());
      },
  
      togglePubs() {
        this.pubsActive = !this.pubsActive;
      },
      toggleRestaurants() {
        this.restaurantsActive = !this.restaurantsActive;
      },
  
      toggleApartments() {
        this.apartmentsActive = !this.apartmentsActive;
      }
  
    }
  }
  </script>
  
  <style>
  #vc2 {
    position: relative;
  }
  
  .vc2Title {
    margin-bottom: 20px;
    color: #FF8A00;
  }
  
  .my-custom-button-class{
    background-color: #FF8A00 !important;
  }
  
  /* CARDS STYLE */
  .accordion {
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 5px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    text-align: justify;
    transition: 0.4s;
    margin-bottom: 10px;
    border-radius: 10px;
    max-width: none;
  }
  
  .active,
  .accordion:hover {
    background-color: #A1D6E2;
    color: #2c3e50;
    padding: 5px;
  }
  
  svg g.buildings path{
    fill-opacity: 0.2;
    stroke: grey;
  }
  
  .button-container {
    position: absolute;
    top: 20px;
    right: 0px;
  }
  
  .button-container button {
    margin-left: 0px;
    background-color: transparent;
    border: none;
    color: white;
    border-radius: 20px;
    padding: 5px 10px;
    transition: background-color 0.3s ease;
    opacity: 0.3;
  }
  
  .button-container .active {
    opacity: 1;
  }
  
  .button-container .pubsButton {
    background-color: #00008B;
  }
  
  .button-container .restButton {
    background-color: #9E1A1A;
  }
  
  .button-container .aparButton {
    background-color: #181818;
  }
  
  
  </style>
  