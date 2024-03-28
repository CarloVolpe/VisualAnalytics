import * as d3 from "d3";

export function createActivityChart(data, svgId) {
  
  const hasTimestamp = data.some(d => d.timestamp && d.timestamp.includes(':'));
  const parseDate = hasTimestamp 
      ? d3.timeParse("%Y-%m-%d %H:%M:%S%Z") 
      : d3.timeParse("%Y-%m-%d");

  // Parsing delle date/timestamp
  data.forEach(d => {
    d.parsedDate = parseDate(d.timestamp || d.date);
  });

  const activities = ['AtHome', 'AtRecreation', 'AtRestaurant', 'AtWork', 'Transport'];
  const margin = { top: 20, right: 100, bottom: 50, left: 50 };
  
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(svgId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Configurazione della scala X
  const xScale = d3.scaleTime().range([0, width]);
  xScale.domain(d3.extent(data, d => d.parsedDate));

  const maxY = d3.max(data, d => Math.max(...activities.map(activity => +d[activity])));
  const yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);

  const color = d3.scaleOrdinal().domain(activities).range(d3.schemeCategory10);

  

  activities.forEach(activity => {
    const activityData = data.map(d => ({
      parsedDate: d.parsedDate,
      value: +d[activity],
    }));

    const line = d3.line()
                   .x(d => xScale(d.parsedDate))
                   .y(d => yScale(d.value));

    svg.append("path")
       .datum(activityData)
       .attr("fill", "none")
       .attr("stroke", color(activity))
       .attr("stroke-width", 1.5)
       .attr("d", line);
  });

  // Configura l'asse X per gestire in modo diverso date e timestamp
  let xAxis;
  if (hasTimestamp) {
    // Per i timestamp, mostra un numero limitato di tick basato sulle ore
    xAxis = d3.axisBottom(xScale).ticks(d3.timeHour.every(1));
  } else {
    // Per le date, mostra un tick per ogni giorno presente nel dataset
    xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d"));
  }

  svg.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(xAxis);

  svg.append("g")
     .call(d3.axisLeft(yScale));


     const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (width + 10) + ", 20)");

  activities.forEach((activity, index) => {
    const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${index * 20})`);

    legendItem.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(activity));

    legendItem.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text(activity)
        .style("text-anchor", "start")
        .style("font-size", "12px");
  });


}
