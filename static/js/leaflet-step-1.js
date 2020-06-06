var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data){
    // console.log(data.features)

    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features)
})

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer){
          layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        pointToLayer: function (feature, latlng) {
          return new L.circle(latlng,{
              radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: 0.75,
              stroke: true,
              color: "#777",
              weight: 0.75
          })
        }
    })

    createMap(earthquakes)
}

function createMap(earthquakes) {
    // Define map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    })

    var overlapMaps = {
        Earthquakes: earthquakes
    }

    var map = L.map("map", {
        center: [37.09, -99.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(map);

}

function getColor(d) {
    return d > 5 ? '#F30' :
    d > 4  ? '#F60' :
    d > 3  ? '#F90' :
    d > 2  ? '#FC0' :
    d > 1   ? '#FF0' :
              '#9F3';
}
  
function getRadius(value){
    return value*35000
}