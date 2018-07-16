// $( document ).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
//   })

$(document).ready(function() {

    ////////////////////////////////////////////////////////////
    // define base map layer
    var grayscale = L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
    });

    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}, detectRetina=true', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxZoom: 16
    });

    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
    });
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // define map position, zoom and layer
    var map = L.map('map', {
        center: [39.5, -98.35],
        zoom: 5,
        layers: [grayscale]
    });
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // define layer control and add to map
    var baseMaps = {
        "Grayscale": grayscale,
        "Esri": esri,
        "OSM": osm
    }

    L.control.layers(baseMaps).addTo(map)
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    // add geocoder
    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
        console.log(e.geocode.center.lat)
        map.flyTo([e.geocode.center.lat, e.geocode.center.lng], 14)

    }).addTo(map)
    ////////////////////////////////////////////////////////////
    

    ////////////////////////////////////////////////////////////
    // add scalebar
    L.control.scale({imperial: true, metric: false}).addTo(map)

    // L.Control.geocoder().addTo(map);


    map.on('click', function(event) {

        $.ajax({url: "/mapclick", data: { 'lat': event.latlng.lat, 'lng': event.latlng.lng}}
              ).success(function(result) {

                var popup = L.popup();
                popup
                    .setLatLng(event.latlng)
                    .setContent("Clicked: " + event.latlng.toString())
                    .openOn(map)
        });
    });
    
})

