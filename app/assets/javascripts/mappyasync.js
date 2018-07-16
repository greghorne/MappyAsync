// $( document ).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
//   })

$(document).ready(function() {

    var map = L.map('map').setView([39.5, -98.35], 5)
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}, detectRetina=true', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        max_zoom:    16
    }).addTo(map)

    map.on('click', function(event) {
        // console.log("lat: " + event.latlng.lat + ", lng: " + event.latlng.lng);
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


