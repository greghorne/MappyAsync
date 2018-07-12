$(function() {


    function onMapClick(e) {
        alert("Map click: " + e);
    }

    var map = document.getElementById("map");

    map.onclick('click', function(ev) {
        alert(ev.latlng); // ev is an event object (MouseEvent in this case)
    });
})

