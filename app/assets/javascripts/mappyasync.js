// $(document).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
// })


////////////////////////////////////////////////////////////
const CONST_MAP_CLICK_MIN_ZOOM = 15;

// default map settings
// const CONST_MAP_DEFAULT_LONGITUDEX = -98.35;
// const CONST_MAP_DEFAULT_LATITUDEY  =  39.5;
const CONST_MAP_DEFAULT_LONGITUDEX = -95.99333;
const CONST_MAP_DEFAULT_LATITUDEY  =  36.14974;
const CONST_MAP_DEFAULT_ZOOM       =   14;


// OSM reverse geocoder
const CONST_OSM_URL             = "https://nominatim.openstreetmap.org/reverse";
const CONST_OSM_FORMAT          = "jsonv2";
const CONST_OSM_GEOCODE_ZOOM    = 18;   // 18 = building level; 
const CONST_OSM_ADDR_DETAILS    =  1;

const CONST_PIN_ANCHOR = new L.Point(48/2, 48);
const CONST_MARKER_ISS = new L.Icon({ iconUrl: "/assets/42598-rocket-icon.png", iconsize: [48, 48], iconAnchor: CONST_PIN_ANCHOR, popupAnchor: [0,-52] });

const CONST_MESSAGE_PROVIDER_CHECKBOX         = "At least one drive-time polygon provider must be selected."
const CONST_MESSAGE_INVALID_XY                = "Calculations are limited to within U.S. borders."
const CONST_MESSAGE_UNABLE_TO_REVERSE_GEOCODE = "Unable to reverse geocode location."

// definition of map layers; first layer is the default layer displayed
const CONST_MAP_LAYERS = [
    {
        // not https so can generate warnings due to mixed content
        // 2018-08-12 - https site currently has a NET::ERR_CERT_COMMON_NAME_INVALID
        name: "Grayscale OSM",
        url: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",      
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Esri OSM",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Hydda OSM",
        url: "https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Basic OSM",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom:  5,
        maxZoom: 17
    },
    {
        name: "Esri World Imagery",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom:  5,
        maxZoom: 17
    }
];
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// prepare indexedDB 
var deleteIndexedDB = window.indexedDB.deleteDatabase("MappyAsync")
var indexedDB       = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
var openedDB = indexedDB.open("MappyAsync", 1);

// key definition
openedDB.onupgradeneeded = function() {
    var db    = openedDB.result;
    var store = db.createObjectStore("LocationStore", {keyPath: "id", autoIncrement: true});
}

// add location info to indexedDB
function addLocationToindexedDB(name, type, latlng) {
    var db      = openedDB.result;
    var tx      = db.transaction(["LocationStore"], "readwrite");
    var store   = tx.objectStore("LocationStore", {keyPath: "id", autoIncrement: true});
    store.put({name: name, type: type, location: {lat: latlng.lat, lng:latlng.lng}})
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function iss(map) {
    // international space station
    try {
        var issIcon = new L.icon({ iconUrl: "/assets/42598-rocket-icon.png" })
        var iss     = new L.marker([0, 0], {icon: CONST_MARKER_ISS, title: "International Space Station"}).addTo(map);
        function moveISS () {
            $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
                iss.setLatLng([data['iss_position']['latitude'], data['iss_position']['longitude']])
                iss.bindPopup("International Space Station", {autoPan: false});
            });
            setTimeout(moveISS, 5000); 
        }
        moveISS();
    } catch {}
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function initCustomButton(map, classString, toolTip, fn) {
    
    var buttonCustomControl = L.Control.extend({
        options: {
            position: 'topright' 
        },
        onAdd: function(map) {
            var container     = L.DomUtil.create('div', classString + ' sidebar-icon button-custom cursor-pointer leaflet-bar');
            container.title   = toolTip
            container.onclick = function(e){ 
                L.DomEvent.stopPropagation(e);
                fn();
            }
            return container;
        }
    });
    map.addControl(new buttonCustomControl());
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function initSlideOutSidebar(map) {
    // credit: https://github.com/Turbo87/leaflet-sidebar
    gSidebar = L.control.sidebar('sidebar', {
        position:    'left',
        closeButton: true,
        autoPan:     false
    });

    map.addControl(gSidebar);
    return gSidebar;
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function initGeocoder(map) {
    // add geocoder and plot marker
    // credit:  https://github.com/perliedman/leaflet-control-geocoder
    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        collapsed:          true,
        position:           'topright'
    }).on('markgeocode', function(e) { 
        mapGoToLatLng(map, e.geocode.center, e.geocode.name) 
    }).addTo(map)

    // add map click event
    map.on('click', function(event) {
        $.ajax({url: "/mapclick", data: { 'lat': event.latlng.lat, 'lng': event.latlng.lng}}).success(function() { 
            mapGoToLatLng(map, event.latlng, "clicked location") 
        })
    });
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function formatAddress(location) {

    var strAddress

    if (location.address.neighbourhood) strAddress = location.display_name.replace(" " + location.address.neighbourhood + ",", "") + "</br>(" + location.address.neighbourhood + ")"
    else strAddress = location.display_name

    strAddress = "<center>" + strAddress.replace(", United States of America", "") + "</center>"
    if (location.address.house_number && location.address.road) {
        strAddress = strAddress.replace(location.address.house_number + ",", location.address.house_number)
    }
    return strAddress
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// handle x,y coordinates from a map click or geocode
function mapGoToLatLng(map, latlng, name) {

    $.ajax({
        url:  "/check_valid_xy.json",
        type: "GET",
        data: { lat: latlng.lat, lng: latlng.lng }
    }).done(function (response) {

        if (!response.valid) {  
            // display x,y out of bounds message
            displayTextControlMsg(map, gTextControlMessage2)
            setTimeout(function() { map.removeLayer(gMarker); }, 3000)
            return;
        } else {

            var zoom;

            ($('#clickAutoZoom').is(":checked")) ? zoom = CONST_MAP_CLICK_MIN_ZOOM : zoom = map.getZoom();
            map.flyTo(latlng, zoom)

            map.removeLayer(gMarker);
            gMarker = new L.marker(latlng, { draggable: true, autopan: true })
            map.addLayer(gMarker);

            if (name == "clicked location") {
                // reverse geocode
                var url     = CONST_OSM_URL
                var params  = { format: CONST_OSM_FORMAT, lat: latlng.lat, lon: latlng.lng, zoom: CONST_OSM_GEOCODE_ZOOM, addressdetails: CONST_OSM_ADDR_DETAILS }

                $.ajax({ type: "GET", url: url, data: params,}).success(function(response) {

                    var address = formatAddress(response)

                    if (!response.error) {
                        gMarker.bindPopup(address).openPopup();
                        addLocationToindexedDB(response.display_name, "click location", { lat: response.lat, lng: response.lon });
                    } else { 
                        displayTextControlMsg(map, gTextControlMessage3)
                    }
                    if (checkBoxChecked(map)) { calculateDemographics({ lat: response.lat, lng: response.lng}) }
                })  
                
            } else {
                gMarker.bindPopup(strAddress = "<center>" + name.replace(", United States of America", "") + "</center>").openPopup();
                addLocationToindexedDB(name, "geocoded location", latlng)
                if (checkBoxChecked(map)) { calculateDemographics(latlng) }
            }

            // CHECK ON THIS!!!  GMH
            gMarker.on('dragend', function(event) {
                mapGoToLatLng(map, event.target._latlng, "clicked location")
                if (checkBoxChecked(map)) { calculateDemographics(event.target._latlng); }
            });
        }
    });
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function displayTextControlMsg(map, control) {
    map.addControl(control)
    setTimeout(function() { map.removeControl(control) }, 10000)
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function checkBoxChecked(map) {
    
    var bing    = $('#bing').is(":checked");
    var targomo = $('#targomo').is(":checked");

    if (!bing && !targomo) {    
        displayTextControlMsg(map, gTextControlMessage)

        if (!gSidebar.isVisible()) gSidebar.show()
        return false;
    }

    return true;
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function calculateDemographics(latlng) {

    var minutes = $('#minutes').val()
    var bing    = $('#bing').is(":checked");
    var targomo = $('#targomo').is(":checked");

    // console.log(minutes + " minutes")
    // console.log(bing + " bing")
    // console.log(targomo + " tarmogo")

    // console.log("calculate demographics")

}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function sidebarOpenClose() { 
    if (gSidebar.isVisible()) { 
        gSidebar.hide() 
    } else { 
        setTimeout(function () { 
            gSidebar.show(); 
        }, 500)
    }
}
////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////
// create text control (leaflet map control that just has text in it)
function textControl(displayText) {

    var textCustomControl = L.Control.extend({
        options: { position: 'bottomright' },
        onAdd: function() {
            var container       = L.DomUtil.create('div', 'highlight-background-message custom-control-message cursor-pointer leaflet-bar', L.DomUtil.get('map'));
            container.innerHTML = "<center>" + displayText + "</center>"
            return container;
        }
    });
    
    return new textCustomControl();
}
////////////////////////////////////////////////////////////////


var gMapLayers   = [];
var gBaseMaps    = {};
var gMarker      = L.marker();
var gSidebar;
var gSidebarHTML = "<h1 style='color: #5e9ca0; text-align: center;'>MappyAsync</h1>\
                    <h3 style='color: #5e9ca0; text-align: left;'>What does it do?</h2>\
                    <p>Given a polygon on the map, calculate demographics within the polygon.</p>\
                    <p>Allow for the creation of isochrones (drive-time polygons)</p>\
                    </br>\
                    <hr size='3' align='center' color='#5e9ca0'>\
                    <h3 style='color: #5e9ca0; text-align: center;'>Settings</hr>\
                    <hr size='3' align='center' color='#5e9ca0'>\
                    <center><p>Drive time polygon (minutes):</center> \
                    <center><select id='minutes'>\
                        <option value='3'>3 minutes</option>\
                        <option value='5'>5 minutes</option>\
                        <option value='8'>8 minutes</option>\
                        <option value='10'>10 minutes</option>\
                    </select></p></center>\
                    <hr size='3' align='center' color='#5e9ca0'>\
                    <center><p>Drive-time polygon providers:</center>\
                        <center><label><input type='checkbox' id='bing' checked='true'> Bing Maps API</label></center>\
                        <center><label><input type='checkbox' id='targomo' checked='true'> Targomo API</label></center>\
                    <hr size='3' align='center' color='#5e9ca0'>\
                        <center><label><input type='checkbox' id='clickAutoZoom' checked='true'> Auto-zoom on map click</label></center>\
                    <hr size='3' align='center' color='#5e9ca0'>";

// leaflet map controls that contain a text message
var gTextControlMessage;
var gTextControlMessage2;
var gTextControlMessage3;


////////////////////////////////////////////////////////////
// build map layers (dynamically) from CONST_MAP_LAYERS
(function() {
 
    for (n = 0; n < CONST_MAP_LAYERS.length; n++) {
        
        gMapLayers[n] = L.tileLayer(CONST_MAP_LAYERS[n].url, { 
            attribution: CONST_MAP_LAYERS[n].attribution, 
            minZoon:     CONST_MAP_LAYERS[n].minZoom, 
            maxZoom:     CONST_MAP_LAYERS[n].maxZoom 
        })
        gBaseMaps[[CONST_MAP_LAYERS[n].name]] = gMapLayers[n];
    }
})()
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// here we go...
$(document).ready(function() {

    // initialize map
    var map = L.map('map', {
        center: [ CONST_MAP_DEFAULT_LATITUDEY, CONST_MAP_DEFAULT_LONGITUDEX ],
        zoom:     CONST_MAP_DEFAULT_ZOOM,
        layers: [ gMapLayers[0] ]
    });

    // initialization of map controls
    gTextControlMessage   = textControl(CONST_MESSAGE_PROVIDER_CHECKBOX)
    gTextControlMessage2  = textControl(CONST_MESSAGE_INVALID_XY)
    gTextControlMessage3  = textControl(CONST_MESSAGE_UNABLE_TO_REVERSE_GEOCODE)
    L.control.layers(gBaseMaps).addTo(map)
    L.control.scale({imperial: true, metric: false}).addTo(map)

    initGeocoder(map)

    initCustomButton(map, "sidebar-icon", "Open/Close Sidebar", sidebarOpenClose);
    gSidebar = initSlideOutSidebar(map)
    gSidebar.setContent(gSidebarHTML);

    iss(map);
})



// create or replace function z_tl_2016_us_state(IN double precision, IN double precision) 
// returns table(gid integer) as $$
// BEGIN
// SELECT gid from tl_2016_us_state
// WHERE ST_Intersects( tl_2016_us_state.geom, ST_GeomFromText('POINT(' || $1 || ' ' || $2 || ')', 4269));
// END;
// $$
// LANGUAGE plpgsql STABLE NOT LEAKPROOF
// COST 100
// ROWS 1;
