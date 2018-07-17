// $( document ).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
//   })


$(document).ready(function() {

    var deleteIndexedDB = window.indexedDB.deleteDatabase("MappyAsync")
    deleteIndexedDB.onsuccess = function(e) {
        console.log("db deleted...")
    }

    deleteIndexedDB.onerror = function(e) {
        console.log("db not found...")
    }



    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
     
    var openedDB = indexedDB.open("MappyAsync", 1);
    
    openedDB.onupgradeneeded = function() {
        var db = openedDB.result;
        var store = db.createObjectStore("MyObjectStore", {keyPath: "id", autoIncrement: true});
        // var index =store.createIndex("CoordinateIndex", ["location.lat", "location.lng"]);
    }
    
    openedDB.onsuccess = function() {
        // var db = openedDB.result;
        // var tx = db.transaction(["MyObjectStore"], "readwrite");
        // var store = tx.objectStore("MyObjectStore");
        // var index = store.index("CoordinateIndex");
    
        // store.put({id: Date().toString(), location: {lat: 36, lng: -97}})
    }




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
    var marker
    var geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            collapsed: true,
            position: 'bottomright'
        }).on('markgeocode', function(e) { mapDoLatLng(e.geocode.center) }).addTo(map)
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // add map click event
    map.on('click', function(event) {
        $.ajax({url: "/mapclick", data: { 'lat': event.latlng.lat, 'lng': event.latlng.lng}}
              ).success(function() { 
                mapDoLatLng(event.latlng) 
        })
    });
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // handle x,y coordinates from a map click or geocode
    function mapDoLatLng(latlng) {

        var mapZoom = map.getZoom();
        (mapZoom < 12) ? zoom = 12 : zoom = mapZoom

        map.flyTo(latlng, zoom)

        if (marker) map.removeLayer(marker);
        marker = new L.marker(latlng, { draggable: true, autopan: true })
        map.addLayer(marker);

        // check indexedDB support
        var db = openedDB.result;
        var tx = db.transaction(["MyObjectStore"], "readwrite");
        var store = tx.objectStore("MyObjectStore", {keyPath: "id", autoincement: true});
        // var index = store.index("CoordinateIndex");
    
        store.put({location: {lat: latlng.lat, lng:latlng.lng}})

        // tx.oncomplete = function() {
        //     db.close();
        //     alert("db closed")
        // }


    }
    ////////////////////////////////////////////////////////////







    map.on('zoomend', function(event) {
        // console.log("zoom changed " + event);
        // console.log(event);
        // console.log(event.sourceTarget['anitmatetozoom']);
    });


    
})

