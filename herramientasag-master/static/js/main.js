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
        hp: parseFloat(d["Hombres en paro"]),
		anio: parseFloat(d["Año"])
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
	
    //render();
///////////
});
