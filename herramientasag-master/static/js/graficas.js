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
}

