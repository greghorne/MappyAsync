// $(document).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
// })


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
function initSidebarButton(map, classString, toolTip, fn) {
    
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
        processLatLng(map, e.geocode.center, e.geocode.name) 
    }).addTo(map)

    // add map click event
    map.on('click', function(event) {
        processLatLng(map, event.latlng, "clicked location") 
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
function processLatLng(map, latlng, name) {

    $.ajax({
        url:  CONST_INTERSECTS_USA_URL + latlng.lng + "/" + latlng.lat,
        type: "GET"
    }).done(function (response) {

        var bIntersects = JSON.parse(response).intersects

        if (!bIntersects) {  
            // display x,y out of bounds message
            displayTextMsg($("#message-popup"), CONST_MESSAGE_INVALID_XY)
            setTimeout(function() { map.removeLayer(gMarker); }, CONST_MESSAGE_INVALID_XY_DISPLAY_TIME)
            return;
        } else {

            // pan & zoom to new location
            ($('#clickAutoZoom').is(":checked")) ? map.flyTo(latlng, CONST_MAP_CLICK_MIN_ZOOM) : map.flyTo(latlng, map.getZoom())

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
                        displayTextMsg($("#message-popup"), CONST_MESSAGE_UNABLE_TO_REVERSE_GEOCODE)
                    }
                    // console.log("response =====")
                    // console.log(response)
                    calculateDemographics(response.lon, response.lat, map)
                })  
                
            } else {
                gMarker.bindPopup(strAddress = "<center>" + name.replace(", United States of America", "") + "</center>").openPopup();
                addLocationToindexedDB(name, "geocoded location", latlng)
                setTimeout(function() {
                    calculateDemographics(latlng.lng, latlng.lat, map)
                }, 3500)
                
            }

            // question gmh
            gMarker.on('dragend', function(event) {
                processLatLng(map, event.target._latlng, "clicked location")
                calculateDemographics(event.target._latlng.lng, event.target._latlng.lat, map);
            });
        }
    });
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function displayTextMsg(element, msg) {

    element[0].innerHTML        = msg
    element[0].style.visibility = 'visible'

    setTimeout(function() { element[0].style.visibility = 'hidden' }, CONST_MESSAGE_DISPLAY_TIME)
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// function checkBoxChecked(map) {

//     if (!gbBing && !gbTargomo) {    
//         displayTextMsg($("#message-popup"), CONST_MESSAGE_PROVIDER_CHECKBOX)
//         map.removeLayer(gMarker)

//         if (!gSidebar.isVisible()) gSidebar.show()
//         return false;
//     }

//     return true;
// }
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
function calculateDemographics(lng, lat, map) {

    var strIsochroneType = document.querySelector('input[name=iso]:checked').value
    console.log(strIsochroneType)

    switch(strIsochroneType) {
        case 'bing':
            process_bing(lng, lat, map);
            break;
        case 'targomo':
            process_targomo(lng, lat, map);
            break;                 
        case 'here':
            process_here(lng, lat, map)
            break;
    }

}
////////////////////////////////////////////////////////////

function getColor(index) {
    
    var isoColor

    switch (parseInt(index)) {
        case 1:
            isoColor = CONST_ISO_COLOR_1;
            break;
        case 2:
            isoColor = CONST_ISO_COLOR_2;
            break;
        case 3:
            isoColor = CONST_ISO_COLOR_3;
            break;
        default:
            console.log("not found")
    }
    return isoColor
}

function process_bing(lng, lat, map) {
    // remove any existing isochrones
    gIsochrones.map(function(isochrone) {
        map.removeLayer(isochrone)
    })
    gIsochrones = []

    // convert minutes into seconds
    var time = []
    var minutes = gsMinutes.split("-").map(function(str) {
        time.push(parseInt(str) * 60)
    })

    var counter = 1
    time.reverse().map(function(seconds) {
        
        //
        // 'index' (integer value) is passed to the ajax call and the same value is returned
        // this is to keep track of what color the polygon should have
        // due to the asynchronous nature of the call, multiple ajax calls may not return in 
        // the order they were called
        //
        $.ajax({ 
            url:  "process_bing.json",
            type: "GET",
            data: { lng: lng, lat: lat, minutes: seconds, bing: gbBing, targomo: gbTargomo, index: counter }
        }).done(function (result) {

            var isoColor = getColor(result['index'])

            gIsochrones.push(L.polygon(result.coordinates[0], {color: isoColor}))
            gIsochrones[gIsochrones.length - 1].addTo(map)
            if (counter >=3 || counter <=4) map.fitBounds(gIsochrones[0].getBounds());
        })
        counter +=1
    })
}

function process_here(lng, lat, map) {

    // remove any existing isochrones
    gIsochrones.map(function(isochrone) {
        map.removeLayer(isochrone)
    })
    gIsochrones = []

    // convert minutes into seconds
    var time = []
    var minutes = gsMinutes.split("-").map(function(str) {
        time.push(parseInt(str) * 60)
    })

    var counter = 1
    time.reverse().map(function(seconds) {
        
        //
        // 'index' (integer value) is passed to the ajax call and the same value is returned
        // this is to keep track of what color the polygon should have
        // due to the asynchronous nature of the call, multiple ajax calls may not return in 
        // the order they were called
        //

        console.log("js seconds: " + seconds)
        $.ajax({ 
            url:  "process_here.json",
            type: "GET",
            data: { lng: lng, lat: lat, minutes: seconds, bing: gbBing, targomo: gbTargomo, index: counter }
        }).done(function (result) {
            console.log("js side in ----------")
            // console.log(result)

            var isoColor = getColor(result['index'])

            gIsochrones.push(L.polygon(result.here, {color: isoColor}))
            gIsochrones[gIsochrones.length - 1].addTo(map)
            if (counter >=3 || counter <=4) map.fitBounds(gIsochrones[0].getBounds());
        })
        counter +=1
    })
}


function process_targomo(lng, lat, map) {

    // remove any existing isochrones
    gIsochrones.map(function(isochrone) {
        map.removeLayer(isochrone)
    })
    gIsochrones = []

    // convert minutes into seconds
    var time = []
    var minutes = gsMinutes.split("-").map(function(str) {
        time.push(parseInt(str) * 60)
    })

    var counter = 1
    time.reverse().map(function(seconds) {
        
        $.ajax({ 
            url:  "process_targomo.json",
            type: "GET",
            data: { lng: lng, lat: lat, minutes: seconds, bing: gbBing, targomo: gbTargomo, index: counter }
        }).done(function (result) {

            var coords = []
            var numberIndicies = result.coordinates[0][0].length

            // reverse lng,lat to lat,lng for leaflet
            for (var n = 0; n < numberIndicies; n++) {
                lat = result.coordinates[0][0][n][1]
                lng = result.coordinates[0][0][n][0]
                coords.push({lat: lat, lng: lng})
            }

            var isoColor = getColor(result['index'])

            gIsochrones.push(L.polygon(coords, {color: isoColor}))
            gIsochrones[gIsochrones.length - 1].addTo(map)
            if (counter >=3 || counter <=4) map.fitBounds(gIsochrones[0].getBounds());

        })
        counter +=1
    })
}


////////////////////////////////////////////////////////////
function sidebarOpenClose() { 
    if (gSidebar.isVisible()) { 
        gSidebar.hide() 
    } else { 
        setTimeout(function () { 
            gSidebar.show(); 
        }, CONST_SLIDEOUT_DELAY_TIME)
    }
}
////////////////////////////////////////////////////////////


////////////////////// global variables ////////////////////////
var gMapLayers   = [];
var gBaseMaps    = {};
var gMarker      = L.marker();
var gSidebar;
var gSidebarHTML = CONST_SLIDEOUT_HTML;

var gsMinutes;
var gbBing;
var gbTargomo;
var gbAutoZoom;

var gIsochrones = [];

////////////////////////////////////////////////////////////////


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
// handlers for controls on slideout panel
function minutesOnChange(sValue) {
    gsMinutes = sValue
}

function isChecked(checkboxID, bChecked) {
    gbAutoZoom = bChecked
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// here we go...
$(document).ready(function() {

    /////////////////////////////////
    // initialize map
    var map = L.map('map', {
        center: [ CONST_MAP_DEFAULT_LATITUDEY, CONST_MAP_DEFAULT_LONGITUDEX ],
        zoom:     CONST_MAP_DEFAULT_ZOOM,
        layers: [ gMapLayers[0] ]
    });
    /////////////////////////////////

   
    /////////////////////////////////
    // initialization of map controls
    L.control.layers(gBaseMaps).addTo(map)
    L.control.scale({imperial: true, metric: false}).addTo(map)

    initGeocoder(map)
    initSidebarButton(map, "sidebar-icon", "Open/Close Sidebar", sidebarOpenClose);

    gSidebar = initSlideOutSidebar(map)
    gSidebar.setContent(gSidebarHTML);
    /////////////////////////////////

    /////////////////////////////////
    // initialize values
    gsMinutes  = $('#minutes').val()
    gbBing     = $('#bing').is(":checked");
    gbTargomo  = $('#targomo').is(":checked");
    gbAutoZoom = $('#clickAutoZoom').is(":checked");
    /////////////////////////////////
 
    iss(map);
})

