<template>
  <b-container id="c2">
    <b-row>
      <b-col>

        <h1 class="vc2Title">City Activity Patterns</h1>

            <i> Through analyzing datasets and visually inspecting graphs, we see how city activity patterns are shaped by various
                factors sometimes resulting in significant changes. Graphs reveal shifts in people's behavior, with peaks indicating
                heightened activity in specific modes. For instance, consistent peaks during work hours suggest a routine that 
                might be disrupted at certain times, possibly due to holidays or special events. These graphs also help track 
                trends over time, indicating shifts in habits or lifestyles within the population.</i>  
    

        
        <div class="accordion" role="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-1 variant="info" class="my-custom-button-class">LOW GRANULARITY LINECHART</b-button>
            </b-card-header>
            <b-collapse id="accordion-1" :visible="false" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <div id="lineChart"></div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

        <p class="empty-space">For the first graph, the total daily frequencies of each category for each day were used. The only 
          information derived pertains to the presence of regular patterns indicative of seasonal or cyclical behaviors linked to 
          daily habits, weekdays, and/or seasons. The high frequency of data results in a very "noisy" visualization. This could 
          be useful for analyzing short-term variations but might make it difficult to identify broader trends.</p>

        
        <div class="accordion" role="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-2 variant="info" class="my-custom-button-class">MEDIUM GRANULARITY LINECHART</b-button>
            </b-card-header>
            <b-collapse id="accordion-2" :visible="false" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <div id="lineChart1"></div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

        <p class="empty-space">For the second graph, a higher level of detail was applied using data from a single week (specifically 
          the first week of the dataset). Therefore, the graph has a shorter time scale compared to the previous one. This aggregation
          helps to better visualize trends without the noise of higher frequency data. Now it's possible to notice around the fourth 
          day a significant decrease in the AtWork category and, to a lesser extent, in the Transport category, along with an increase 
          in the AtHome and AtRecreation categories.</p>

        
        <div class="accordion" role="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-3 variant="info" class="my-custom-button-class">HIGH GRANULARITY LINECHART</b-button>
            </b-card-header>
            <b-collapse id="accordion-3" :visible="false" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <div id="lineChart2"></div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

        <p class="empty-space">In this graph, an even finer temporal granularity was used, distributing the data over 24 hours. 
          From visual analysis, we can see that: The number of people "At Home" sharply declines in the early morning hours and 
          remains low until evening, indicating when people likely leave home for work or other activities."At Work" experiences 
          a sharp peak during working hours, presumably from 9 AM to 5 PM, with a decline afterward indicating the end of the 
          workday."Transport" shows two peaks, likely corresponding to morning and evening rush hours when people commute to and 
          from work."Recreation" and "Restaurant" exhibit an increase in the evening hours, possibly reflecting leisure time after 
          work. The pattern shown in the graph is typical of a standard weekday during which most people follow a 9-5 work 
          routine and have leisure time in the evening.</p>

        
        <div class="accordion" role="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-4 variant="info" class="my-custom-button-class">MEDIUM GRANULARITY LINECHART FOR THE CHRISTMAS HOLIDAYS</b-button>
            </b-card-header>
            <b-collapse id="accordion-4" :visible="false" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <div id="lineChart3"></div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

        <p class="empty-space">The fourth chart adopted a medium granularity approach within a specific timeframe coinciding with the 
          Christmas holidays. As expected, significant variations are observed in the AtHome (increasing), AtWork (decreasing), and 
          Transport (slightly decreasing) categories. On the other hand, AtRecreation and AtRestaurant show less pronounced variations. 
          These observations are consistent with the behavioral patterns often seen during holidays and can help answer the question of 
          how patterns change in the city. People tend to alter their daily routines during significant periods such as holidays, and 
          these changes are often reflected in mobility and activity data.</p>

      </b-col>
    </b-row>
  </b-container>
</template>
  
  <script>
  import * as d3 from 'd3'; 
  import { createActivityChart } from '@/assets/LineChart_Q4.js'; 
  
  export default {
    mounted() {

        d3.csv("Pivot_all.csv").then(data => { 
        createActivityChart(data, "#lineChart");
        }).catch(error => console.error("Error loading the CSV file:", error));
        
        d3.csv("Pivot_week.csv").then(data => { 
        createActivityChart(data, "#lineChart1");
        }).catch(error => console.error("Error loading the CSV file:", error));

        d3.csv("Pivot_day.csv").then(data => { 
        createActivityChart(data, "#lineChart2");
        }).catch(error => console.error("Error loading the CSV file:", error));

        d3.csv("Pivot_week_Nat.csv").then(data => { 
        createActivityChart(data, "#lineChart3");
        }).catch(error => console.error("Error loading the CSV file:", error));




    }
  }
  </script>

<style>

  
  /* STILE PER GLI ACCORDION */
  .accordion-1{
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
  
  .accordion-1 .active,
  .accordion-1:hover {
    background-color: #A1D6E2;
    color: #2c3e50;
    padding: 5px;
  }

  

  .accordion-2 {
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
    /* Stili per il secondo accordion */
  }

  .accordion-2 .active,
  .accordion-2:hover {
    background-color: #A1D6E2;
    color: #2c3e50;
    padding: 5px;
  }


  .accordion-3{
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
    /* Stili per il terzo accordion */
  }

  .accordion-3 .active,
  .accordion-3:hover {
    background-color: #A1D6E2;
    color: #2c3e50;
    padding: 5px;
  }


  .accordion-4{
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
    /* Stili per il quarto accordion */
  }

  .accordion-4 .active,
  .accordion-4:hover {
    background-color: #A1D6E2;
    color: #2c3e50;
    padding: 5px;
  }


</style>
  