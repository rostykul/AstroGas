var scroll_el = document.getElementById("scrolling");

window.addEventListener("scroll", () => {
    scroll_el.style.setProperty("--scroll", window.pageYOffset);
    //alert("value: " + window.pageYOffset);
});
//scroll_el.style.setProperty("margin", "50px");

//AutoFill Google Script
function mod(n, m) {
    return ((n % m) + m) % m;
}
$(document).ready(function () {
    var autocomplete;
    autocomplete = new window.google.maps.places.Autocomplete((document.getElementById('location')), {
        types: ['geocode']
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
        document.getElementById('latitude_view').innerHTML = near_place.geometry.location.lat();
        document.getElementById('longitude_view').innerHTML = near_place.geometry.location.lng();
        var time = new Date();
        var local_time_min = mod((time.getUTCHours() * 60 + time.getUTCMinutes() + near_place.utc_offset_minutes), 1440);
        var local_hours = Math.floor(local_time_min / 60);
        var local_mins = mod(local_time_min, 60);
        alert("Local Time: " + local_hours + ":" + local_mins);
    });
});