// Source code from https://www.chartfleau.com/tutorials/d3swarm/
$(document).ready(function() {
    const width = 400;
    const height = 700;

    let svg = d3
        .select("#notTheBees")
        .append("svg")
        .attr("height", height)
        .attr("width", width);

    var url = "static/data/June_July_Earthquake.json";
    var hoururl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    var dayurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    var weekurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    d3.json(dayurl).then((data) => {


        let quakedata = data.features;
        let mags = []
        let depths = []
        quakedata.forEach(function(d) {
            mags.push(+d.properties.mag);
            depths.push(+d.geometry.coordinates[2]);
        })

        let xScale = d3.scaleOrdinal().domain("Magnitude").range([0, 100]);

        let yScale = d3
            .scaleLinear()
            .domain(d3.extent(mags))
            .range([height - 50, 50]);

        //Radius
        let size = 4

        //Draw each circle
        svg
            .selectAll(".circ")
            .data(quakedata)
            .enter()
            .append("circle")
            .attr("class", "circ")
            .attr("fill", "red")
            .attr("stroke", "black")
            .attr("r", size)
            .attr("cx", (width / 2))
            .attr("cy", (d) => yScale(d.properties.mag));

        //Force points to not overlap
        let simulation = d3
            .forceSimulation(quakedata)
            .force(
                "x",
                d3
                .forceX((width / 2))
                .strength(0.05)
            )
            .force(
                "y",
                d3
                .forceY(function(d) {
                    return yScale(d.properties.mag);
                })
                .strength(1)
            )
            .force(
                "collide",
                d3
                .forceCollide(size)
                .strength(1)
            )

        //Timer and tick function for animation
        .alphaDecay(0)
            .alpha(1)
            .on("tick", tick);

        function tick() {
            d3.selectAll(".circ")
                .attr("cx", (d) => {
                    return +d.x;
                })
                .attr("cy", (d) => d.y);
        }

        let init_decay = setTimeout(function() {
            console.log("start alpha decay");
            simulation.alphaDecay(1);
        }, 8000);
    });
})