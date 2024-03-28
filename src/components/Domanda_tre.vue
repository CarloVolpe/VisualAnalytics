<template>
    <div id="q3" class="q3-container">

      <h1 class="vc2Title">Daily Pattern Analysis</h1>

      <i>For the observation, two very dissimilar participants were selected, identified using Euclidean distance as a measure of similarity
        between participants.</i>

      <div class="accordion" role="tablist">
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle.accordion-1 variant="info" class="my-custom-button-class">TIME TRACKING MAP</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" :visible="false" accordion="my-accordion" role="tabpanel">
                  <b-card-body>

                            <div ref="mapUnique" id="map" @mouseover="pauseAnimation" @mouseleave="resumeAnimation" style="width: 700px; height: 700px; float: left;">
                              
                              <svg width="100%" height="700px">
                                  <g class="buildings"></g>
                              </svg>
                            </div>
                            <p id="timestamp" style="text-align: center;">Time: </p>

                            <div style="position: absolute; bottom: 20px; left: 20px; display: flex;">
                              <select @change="onParticipantIdChange($event)" style="position: absolute; bottom: 20px; left: 20%;">
                                  <option value="" disabled selected>Select a ParticipantId</option>
                                  <option v-for="id in participantIds" :key="id" :value="id">{{ id }}</option>        
                              </select>

                              <select @change="onDateChange($event)" style="position: absolute; bottom: 40px; left: 20px;">

                                  <option value="" disabled selected>Select a Date</option>
                                  <option v-for="date in availableDates" :key="date" :value="date">{{ date }}</option>
                              </select>
                          
                            </div>

                            <div id="legend" style="position: absolute; bottom: 260px; right: 20px; width: 180px; background-color: white; padding: 10px; border: 1px solid #ccc;">
                            <h4>Legenda</h4>
                            <div v-for="(color, activity) in activityColors" :key="activity" style="display: flex; align-items: center; margin-bottom: 5px;">
                              <div :style="{ backgroundColor: color, width: '10px', height: '10px', marginRight: '5px', borderRadius: '50%' }"></div>
                              <span>{{ activity }}</span>
                            </div>
                          </div>

                          <div id="infoPanel" style="position: absolute; top: 20px; left: 720px; background-color: white; padding: 10px; border: 1px solid #ccc; display: none;">
                              <p id="infoText">Mouseover on a marker for the info.</p>

                          </div>

              </b-card-body>
          </b-collapse>
        </b-card>
    </div>

    <div class="content-wrapper">

      <h1>Spatial Analysis</h1>

      <p class="empty-space"> Participant ID 235 lives between C and D zones - and works in the same zone, very close to home.
        He moves for entertainment always within zone C with high recreational density. Participant ID 816 lives at the southern
        tip of zone A - works far from home in zone G and moves to restaurants near home or workplace. The daily routine of the 
        two participants is very different, mainly dictated by the distance between home and work. On the map, variations in 
        state over time are recorded concerning the following spatial parameters: AtHome - AtWork - AtRestaurant - AtRecreation 
        - Transport. Corresponding to the spatial and temporal state, the physical state of the ID is recorded according to the 
        following parameters: HungerStatus and SleepStatus. Significant behavioral differences emerged from an observation of the 
        participants' time tracking: ID 235 wakes up no earlier than 08:00, takes a few minutes to reach the workplace, stays at
        work for about eight hours, and extends dinner and entertainment until late at night, frequenting the central area where 
        they live. He goes to bed after midnight. ID 816 leads a different life, waking up early in the morning, around 05:30, 
        and taking about two hours to reach the workplace. He works for eight hours and returns home where he goes to bed around 
        21:00. He usually eats (or buys takeout food) in places near home or work.</p>
      </div>  

    </div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  import { getSingleEndpoint } from "@/assets/api_connector";
  import wkx from 'wkx';

  import { BuildingMap2 } from "@/assets/BuildingMap_Q3.js";
  const bm = new BuildingMap2();

  export default {
    name: 'MapComponent',
    data() {
      return {
        buildings: [],
        allParticipantMovements: [],
        participantMovements: [], 
        participantIds: [],
        selectedParticipantId: null,
        availableDates: [],
        animationPaused: false, 
        animationInterval: null,
        activityColors: {
        'AtHome': '#38a3a5', 
        'AtWork': '#023047', 
        'AtRestaurant': '#f77f00',
        'AtRecreation': '#c1121f',
        'Transport': "#7f4f24"
        }
      };
    },
    mounted() {
      this.loadParticipantMovements();
      this.loadBuildings();
    },

    beforeDestroy(){
        if(this.animationInterval){
            clearInterval(this.animationInterval);
        }
    },
    
    methods: {

      async loadBuildings() {
        
        const response = await getSingleEndpoint({}, 'Buildings');
        this.buildings = response.data.map(d => ({
          type: "Feature",
          geometry: wkx.Geometry.parse(Buffer.from(d.location, 'hex')).toGeoJSON(),
          properties: {
            buildingId: d.buildingId,
            buildingType: d.buildingType,
            maxOccupancy: d.maxOccupancy,
            units: d.units,},
        }));
        this.drawMap();

      },
      async loadParticipantMovements() {
        
        const movementsData = await d3.csv("participant_235_816.csv");
        this.allParticipantMovements = movementsData.map(d => ({
          participantId: d.participantId,
          timestamp: d.timestamp,
          currentMode: d.currentMode,
          hungerStatus: d.hungerStatus,
          sleepStatus: d.sleepStatus,
          currentLocation: d.currentLocation.match(/POINT \(([^ ]+) ([^ ]+)\)/).slice(1).map(Number),

          date: d.date,
        }));
        this.participantIds = [...new Set(this.allParticipantMovements.map(d => d.participantId))];
        
        this.availableDates = [...new Set(this.allParticipantMovements.map(d => d.date))].sort((a, b) => {return new Date(a) - new Date(b);});

        console.log("Participant IDs:", this.participantIds);
        console.log("Available Dates:", this.availableDates);
      },
      drawMap() {
        const svg = d3.select(this.$refs.mapUnique).select("svg");
        
        svg.datum(this.buildings).call(bm);
        
        
      },

      clearMarkers(){
        d3.select(this.$refs.mapUnique).select("svg").selectAll(".participant-marker").remove();
      },

      updateParticipantLocation(index) {
        const movement = this.participantMovements[index];
        const svg = d3.select(this.$refs.mapUnique).select("svg");
        svg.selectAll(".participant-marker").remove();
        
        const projection = d3.geoIdentity().reflectY(true).fitSize([700, 700], bm.extent());
  
        svg.selectAll(".participant-marker")
            .data([movement], d => d.timestamp)
            .join(enter => enter.append("circle")
              .attr("class", "participant-marker")
              .attr("cx", d => projection(d.currentLocation)[0])
              .attr("cy", d => projection(d.currentLocation)[1])
              .attr("r", 5)
              .attr("fill", d => this.getColorForActivity(d.currentMode))
              .on("mouseover", (event,d) => {
                const infoPanel = document.getElementById("infoPanel");
                const infoText = document.getElementById("infoText");
                infoText.innerHTML = `ID: ${d.participantId}<br>Timestamp: ${d.timestamp}<br>Activity: ${d.currentMode}<br>Position: ${d.currentLocation.join(', ')}<br>HungerStatus: ${d.hungerStatus}<br>SleepStatus: ${d.sleepStatus}`;
                infoPanel.style.display = "block";
              })
              .on("mouseout", () => {
                document.getElementById("infoPanel").style.display = 'none';
              })
          );

          document.getElementById("timestamp").innerText = `Time: ${movement.timestamp}`;
      },
      animateParticipantMovement() {
        let index = 0;
        this.animationInterval = setInterval(() => {
          if (index < this.participantMovements.length && !this.animationPaused) {
            console.log("Animating Movement for Index: ", index);
            this.updateParticipantLocation(index++);
          } else if (index >= this.participantMovements.length) {
            console.log("clearing interval");
            clearInterval(this.animationInterval);
            this.animationInterval = null; 
          }
        }, 750); 
      },

      onParticipantIdChange(event){
        const selectedId = event.target.value;
        this.selectedParticipantId = selectedId;
        this.filterDataByParticipantId(selectedId);
        this.clearMarkers();
        this.startAnimation();
        
      },

      onDateChange(event){
        const selectedDate = event.target.value;
        this.participantMovements= this.allParticipantMovements.filter(d => d.date === selectedDate && d.participantId === this.selectedParticipantId);
        this.clearMarkers();
        this.startAnimation()
      },

      filterDataByParticipantId(selectedId){
        this.participantMovements= this.allParticipantMovements.filter(d => d.participantId.toString() === selectedId);
        console.log('Dati filtrati per participantId:', this.participantMovements);
      },

      filterDataByDate(selectedDate) {
            
            this.participantMovements = this.participantMovements.filter(d => d.date === selectedDate);
            console.log('Dati filtrati per data:', this.participantMovements);
        },


      startAnimation(){
        console.log('Starting Animation')
        if(this.animationInterval){
            console.log('Clearing existing animation interval')
            clearInterval(this.animationInterval);
        }
        this.animationInterval = null;
        
        this.animateParticipantMovement();
      },

      pauseAnimation() {
        this.animationPaused = true;
      },
      resumeAnimation() {
        this.animationPaused = false;
      },
      getColorForActivity(activity) {
        const activityToColorMap = {
        'AtHome': '#38a3a5', 
        'AtWork': '#023047', 
        'AtRestaurant': '#f77f00', 
        'AtRecreation': '#c1121f',
        'Transport': "#7f4f24"
          
        };
        return activityToColorMap[activity] || 'black'; 
      },
    },
  };
  </script>
  
  <style>
    svg g.buildings path{
        fill-opacity: 0.8;
        stroke: grey;
        stroke-width: 1px;
    }

  
  </style>
  