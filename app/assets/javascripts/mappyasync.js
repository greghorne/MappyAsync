// $( document ).on('turbolinks:load', function() {
//     console.log("It works on each visit!")
//   })

  

$(document).ready(function() {

    $('#map').click(function(event) {
        alert(event.latlng);
    })

    // function onMapClick(object, e) {
    //     alert("Map click: " + e.latlng);
    // }

    // document.getElementById("map").onclick = onMapClick;
    // document.getElementById("map").onclick(this, onMapClick);

    // mymap.on('click', function(ev) {
    //     alert(ev.latlng); // ev is an event object (MouseEvent in this case)
    // });

});
