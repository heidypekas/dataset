d3.csv("https://raw.githubusercontent.com/heidypekas/dataset/main/paro1.csv", function (d) {
    return {
        date: d3.timeParse("%Y-%m-%d")(d["Fecha"]),
        eci: parseFloat(d["Evolucion de la contratacion Indefinido"]),
        ect: parseFloat(d["Evolucion de la contratacion Temporal"]),
        tpi: parseFloat(d["Total de población inactiva"]),
        otc: parseFloat(d["Ocupados a tiempo completo"]),
        otp: parseFloat(d["Ocupados a tiempo parcial"]),
        pp: parseFloat(d["Personas en paro"]),
        na: parseFloat(d["Número de activos"]),
        etc: parseFloat(d["Evolución a tiempo completo"]),
        etp: parseFloat(d["Evolución a tiempo parcial"]),
        rfd: parseFloat(d["Robos con fuerza en domicilios"]),
        hrcs: parseFloat(d["Homicidios registrados por los cuerpos de seguridad"]),
        itd: parseFloat(d["Infracciones por tráfico de drogas"]),
        rvi: parseFloat(d["Robos con violencia e intimidación"]),
        mp: parseFloat(d["Mujeres en paro"]),
        hp: parseFloat(d["Hombres en paro"])
    }
}).then((localData) => {
   
    data = localData;
    colores = d3.scaleOrdinal().domain(Object.keys(data[0]))
        .range(["white", "#089296", "#ffd700", "#69b3a2", "#040404", "#808080", "#006400", "#ffc0cb", "#a52a2a", "#6a5acd", "#089296", "#ffa500", "#ff0000", "#0000ff"])

    indices.forEach(indice => {
        if (document.getElementById(indice).checked) {
            intercambiar(indice);
        }
    })
    
    
    mujeres = 0.0;
    hombres = 0.0;
    cont = 0;
    // parse data
    data.forEach(function(d) {
        cont = cont+1;
        d.count = +d.count;
        d.state = d.state;
        mujeres = mujeres+d.mp;
        hombres = hombres+d.hp;
        
    })
    //render();
///////////

// set the dimensions and margins of the graph
var widthP = 300
    heightP = 300
    marginP = 30

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(widthP, heightP) / 2 - marginP
var radius2 = Math.min(widthP, heightP) / 2

const labelArc = d3.arc()
                    .outerRadius(radius2)
                    .innerRadius(-20);
// set the color scale
const color = d3.scaleOrdinal()
            .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

// Create dummy data
const data2 = [{
               "genero": "Mujeres",
               "valor": mujeres/cont
              }, 
              {
               "genero": "Hombres",
               "valor": hombres/cont
              }]

// Compute the position of each group on the pie:
const pie = d3.pie().value(function(d) {return d.valor});
const data_ready = pie(data2)
console.log(data_ready)
    
// append the svg object to the div called 'my_dataviz'
var svgP = d3.select("#pieChart")
            .append("svg")
            .attr("width", widthP)
            .attr("height", heightP)
            .append("g")
            .attr("transform", "translate(" + widthP / 2 + "," + heightP / 2 + ")")

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svgP.selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
    .attr('fill', function(d){ return(color(d.data.valor)) })
    //.attr("stroke", "black")
    //.style("stroke-width", "2px")
    .style("opacity", 0.7)
  
svgP.selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d){ return d.data.genero})
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";  })
    .attr('dy', '.35em')
    .style("text-anchor", "middle")
    .style("font-size", 16)
    
   
const marginB = {
    top: 10, right: 30, bottom: 30, left: 60
},
    widthB = 650 - margin.left - margin.right,
    heightB = 300 - margin.top - margin.bottom;
    
var xScale = d3.scaleTime().domain(d3.extent(data, function (d) { return d.date; }))
            .range([0, widthB]);
//var xScale = d3.scaleBand()
//          .range([0, width])
//          .padding(0.1)
//          .domain(data.map(function(d) { return d.date; }));
    
var yScale = d3.scaleLinear()
            .range ([heightB, 0])
            .domain([0, d3.max(data, function(d) { return d.hp; })]);
    
var svgB = d3.select("#barChart")
            .append("svg")
            .attr("width", widthB + margin.left + margin.right)
            .attr("height", heightB + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
    svgB.append("g")
        .attr("transform", `translate(0, ${heightB})`)
        .call(d3.axisBottom(xScale));
    
    svgB.append("g")
        .call(d3.axisLeft(yScale));

    svgB.selectAll('whatever')
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.date); })
         .attr("y", function(d) { return yScale(d.mp); })
         .attr('opacity', 0.6)
         .attr("width", 10)
         .attr("height", function(d) { return heightB - yScale(d.mp); });
    
    svgB.selectAll('whatever')
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.date); })
         .attr("y", function(d) { return yScale(d.hp); })
         .attr('opacity', 0.6)
         .attr("width", 10)
         .attr("height", function(d) { return heightB - yScale(d.hp); });
    
    // Add x axis
    svgB.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Add y axis
    svgB.append("g")
        .call(d3.axisLeft(yScale));
    
});
