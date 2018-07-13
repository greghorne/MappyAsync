// $( document ).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
//   })

  

$(document).ready(function() {

    map.on('click', function(event) {
        console.log("lat: " + event.latlng.lat + ", lng: " + event.latlng.lng);
        $.ajax({url: "/mapclick", data: { 'lat': event.latlng.lat, 'lng': event.latlng.lng}}
              ).done(function(result) {
                console.log(result) 
                var popup = L.popup();
                popup
                    .setLatLng(event.latlng)
                    .setContent("Clicked: " + event.latlng.toString())
                    .openOn(map)

            });
    });

})
