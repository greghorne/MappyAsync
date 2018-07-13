// $( document ).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
//   })

  

$(document).ready(function() {

    map.on('click', function(event) {
        console.log("lat: " + event.latlng.lat + ", lng: " + event.latlng.lng);
        $.ajax("/mapclick")
    });

    // map.on('click', function() {
        // $.ajax("")
    // });

    // map.on('click', function(event) {
    //     console.log("lat: " + event.latlng.lat + ", lng: " + event.latlng.lng);
    // });

});
