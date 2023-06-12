// Earthquake data URL
const earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Initiate map
const earthMap = L.map("map", {
    center: [40.09, -90.71],
    zoom: 6
});

// Append a tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(earthMap);

// Fetch earthquake data and incorporate it into the map
d3.json(earthquakeDataURL).then((earthquakeData) => {
    const styleEarthquake = (quake) => {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: colorByDepth(quake.geometry.coordinates[2]),
            color: "black",
            radius: radiusByMagnitude(quake.properties.mag),
            stroke: true,
            weight: 0.6
        };
    }
    const colorByDepth = (depth) => {
        switch (true) {
            case depth > 100: return "red";
            case depth > 80: return "orangered";
            case depth > 60: return "orange";
            case depth > 40: return "gold";
            case depth > 20: return "yellow";
            default: return "lightgreen";
        }
    }
    const radiusByMagnitude = (magnitude) => {
        if (magnitude === 0) {
            return 1.5;
        }
        return magnitude * 4.5;
    }
    L.geoJson(earthquakeData, {
        pointToLayer: (quake, latlng) => {
            return L.circleMarker(latlng);
        },
        style: styleEarthquake,
        onEachFeature: (quake, layer) => {
            layer.bindPopup(`Magnitude: ${quake.properties.mag} <br>Location: ${quake.properties.place} <br>Depth: ${quake.geometry.coordinates[2]}`);
        }
    }).addTo(earthMap);

// Append legend with color codes for depth
let legend = L.control({position: "bottomright"});
legend.onAdd = () => {
  let div = L.DomUtil.create("div", "info legend"),
  depths = [-10, 20, 40, 60, 80, 100];

  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
    `<i style="background:${colorByDepth(depths[i] + 1)}"></i> ${depths[i]} ${(depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+')}`;
  }
  return div;
};
legend.addTo(earthMap)
});
