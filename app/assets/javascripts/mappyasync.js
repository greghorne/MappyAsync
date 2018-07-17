// $(document).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
// })


////////////////////////////////////////////////////////////
// prepare indexedDB 
////////////////////////////////////////////////////////////
var deleteIndexedDB = window.indexedDB.deleteDatabase("MappyAsync")

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
var openedDB = indexedDB.open("MappyAsync", 1);

openedDB.onupgradeneeded = function() {
    var db = openedDB.result;
    var store = db.createObjectStore("LocationStore", {keyPath: "id", autoIncrement: true});
}
////////////////////////////////////////////////////////////


$(document).ready(function() {

    ////////////////////////////////////////////////////////////
    // define base map layer
    var grayscale = L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoon: 6,
        maxZoom: 15
    });

    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}, detectRetina=true', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        minZoom: 6,
        maxZoom: 15
    });

    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom: 6,
        maxZoom: 15
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
    // define base maps and layer control and add to map
    var baseMaps = {
        "Grayscale": grayscale,
        "Esri": esri,
        "OSM": osm
    }
    L.control.layers(baseMaps).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add scalebar
    L.control.scale({imperial: true, metric: false}).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add geocoder and plot marker
    var geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            collapsed: true,
            position: 'bottomright'
        }).on('markgeocode', function(e) { 
            console.log(e)
            mapDoLatLng(e.geocode.center, e.geocode.name) 
        }).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add map click event
    map.on('click', function(event) {
        $.ajax({url: "/mapclick", data: { 'lat': event.latlng.lat, 'lng': event.latlng.lng}}
              ).success(function() { 
                mapDoLatLng(event.latlng, "clicked location") 
        })
    });
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // handle x,y coordinates from a map click or geocode
    function mapDoLatLng(latlng, name) {

        var mapZoom = map.getZoom();
        (mapZoom < 12) ? zoom = 12 : zoom = mapZoom

        map.flyTo(latlng, zoom)

        if (marker) map.removeLayer(marker);
        marker = new L.marker(latlng, { draggable: true, autopan: true })
        map.addLayer(marker);

        // open indexedDB and add lat,lng


        if (name == "clicked location") {
                url = "https://nominatim.openstreetmap.org/reverse?" +  
                      "format=jsonv2&lat=" + latlng.lat + "&lon=" + latlng.lng + "&zoom=18&addressdetails=1"

                $.ajax({url: url}).success(function(response) {

                    // strip ", United States of America" from display_name
                    // if (response.display_name.slice(response.display_name.length - ", United States of America".length, response.display_name.length) == ", United States of America") {
                    //     var prepared_name = response.display_name.slice(0, response.display_name.length - ", United States of America".length)
                    // } else {
                    //     var prepared_name = response.display_name
                    // }
                    marker.bindPopup(response.display_name).openPopup();
                    addLocationToDB(response.display_name, "click location", latlng)
                })

        } else {
            marker.bindPopup(name).openPopup();
            addLocationToDB(name, "geocoded location", latlng)
        }
    }
    ////////////////////////////////////////////////////////////

    marker.on('dragend', function(event) {
        console.log(event.target._latlng)
    })

    // marker.move = function(e) {
    //     console.log(e)
    // }


    function addLocationToDB(name, type, latlng) {
        var db = openedDB.result;
        var tx = db.transaction(["LocationStore"], "readwrite");
        var store = tx.objectStore("LocationStore", {keyPath: "id", autoIncrement: true});
        store.put({name: name, type: type, location: {lat: latlng.lat, lng:latlng.lng}})
    }



    map.on('zoomend', function(event) {
        // console.log("zoom changed " + event);
        // console.log(event);
        // console.log(event.sourceTarget['anitmatetozoom']);
    });
})

