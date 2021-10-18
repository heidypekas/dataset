const nombres = {
    date: "Fecha",
    eci: "Evolucion de la contratacion Indefinido",
    ect: "Evolucion de la contratacion Temporal",
    tpi: "Total de población inactiva",
    otc: "Ocupados a tiempo completo",
    otp: "Ocupados a tiempo parcial",
    pp: "Personas en paro",
    etc: "Evolución a tiempo completo",
    etp: "Evolución a tiempo parcial",
    na: "Número de activos",
    rfd: "Robos con fuerza en domicilios",
    hrcs: "Homicidios registrados por los cuerpos de seguridad",
    itd: "Infracciones por tráfico de drogas",
    rvi: "Robos con violencia e intimidación",
    mp: "Mujeres en paro",
    hp: "Hombres en paro"
};

var data = [];
var colores = {};

var indices = [
    'eci',
    'ect',
    'tpi',
    'otc',
    'otp',
    'pp',
    'etc',
    'etp',
    'na',
    'rfd',
    'hrcs',
    'itd',
    'rvi',
];

var activas = [];

// set the dimensions and margins of the graph
const margin = {
    top: 10, right: 30, bottom: 30, left: 60
},
    width = 650 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg = d3.select("#lineas")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select('.tooltip-area')
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");
	
	
// set the dimensions and margins of the graph
var widthP = 300
    heightP = 300
    marginP = 30
	
// append the svg object to the div called 'my_dataviz'
var svgP = d3.select("#pieChart")
            .append("svg")
            .attr("width", widthP)
            .attr("height", heightP)
            .append("g")
            .attr("transform", "translate(" + widthP / 2 + "," + heightP / 2 + ")")
			
const marginB = {
    top: 10, right: 30, bottom: 30, left: 60
},
    widthB = 650 - margin.left - margin.right,
    heightB = 300 - margin.top - margin.bottom;

var svgB = d3.select("#barChart")
            .append("svg")
            .attr("width", widthB + margin.left + margin.right)
            .attr("height", heightB + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

function maximo() {
    let _maximo = -Infinity;
    activas.forEach(element => {
        data.forEach(dato => {
            if (dato[element] > _maximo) {
                _maximo = dato[element];
            }
        })
    });
    return _maximo;
}


function elimninarNaN(element) {
    let newData = [];
    data.forEach(d => {
        if (!isNaN(d[element])) {
            newData.push(d);
        }
    });
    return newData;
}



// http://bl.ocks.org/fryford/2925ecf70ac9d9b51031
function animateline(element) {
    // Get the length of each line in turn
    var totalLength = d3.select("#line" + element).node().getTotalLength();

    d3.select("#line" + element)
        .style("opacity", "0.7")
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(500)
        //.ease("quad")
        .attr("stroke-dashoffset", 0)
        .style("stroke-width", 3);
}


function render(element) {
    svg.selectAll("*").remove();

    svg.append("svg")
        .attr("width", '100%')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, maximo()])
        .range([height, 0]);


    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.selectAll('.tick').on('click', function(d) { console.log(d); });

    const mouseover = (event, d) => {
        tooltip.style("visibility", "visible");
    };


    const mouseleave = (event, d) => {
        tooltip.style("visibility", "hidden");
    }


    const _mousemove = (event, d, element) => {
        let [xx, yy] = d3.pointer(event);
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px")
            .html(`
                <div class="container">
                    <div class="quicksand text-center"><b>${nombres[element]}</b></div>
                    <div class="row quicksand"> 
                        <div class="col">${moment(x.invert(xx)).format('L')}</div>
                        <div class="col">Valor: ${Math.floor(y.invert(yy))}</div>
                    </div>
                <div>
            `);
		
		var anioE = moment(x.invert(xx)).format('YYYY');
		
		console.log("Año Event " + anioE);
		graficas2(anioE);
    };

    activas.forEach(element => {
        svg.append("path")
            .attr("class", "line")
            .attr("id", "line" + element)
            .attr("stroke-linecap", "round")
            .style("opacity", "0")
            .datum(elimninarNaN(element))
            .attr("fill", "none")
            .attr("stroke", colores(element))
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.date) })
                .y(function (d) { return y(d[element]) })
            )
            .on("mousemove", (event, d) => { _mousemove(event, d, element); })
            .on("mouseleave", mouseleave)
            .on("mouseover", mouseover);

        setTimeout(animateline(element), 1000);
    });
}


function intercambiar(elemento) {
    let index = activas.indexOf(elemento)
    if (index == -1) {
        activas.push(elemento)
    } else {
        activas.splice(index, 1)
    }
    render();
	//graficas2();
}

function graficas2(anioEvent){
	svgP.selectAll("*").remove();
	svgB.selectAll("*").remove();
	mujeres = 0.0;
    hombres = 0.0;
    cont = 0;
    // parse data
    data.forEach(function(d) {
		if(d.anio == anioEvent){
			cont = cont+1;
			d.count = +d.count;
			d.state = d.state;
			mujeres = mujeres+d.mp;
			hombres = hombres+d.hp;
		}
    })
	
	console.log("Final" + " - " + mujeres + " - " + hombres);

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
    
var xScale = d3.scaleTime().domain(d3.extent(data, function (d) { return d.date; }))
            .range([0, widthB]);
//var xScale = d3.scaleBand()
//          .range([0, width])
//          .padding(0.1)
//          .domain(data.map(function(d) { return d.date; }));
    
var yScale = d3.scaleLinear()
            .range ([heightB, 0])
            .domain([0, d3.max(data, function(d) { return d.hp; })]);
     
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
}
