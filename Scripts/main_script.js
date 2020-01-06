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
    var pac_input = document.getElementById('location');
    var autocomplete = new google.maps.places.Autocomplete(pac_input, {
        types: ['geocode']
    });
    enableEnterKey(pac_input);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
        document.getElementById('latitude_view').textContent = near_place.geometry.location.lat();
        document.getElementById('longitude_view').textContent = near_place.geometry.location.lng();
        var time = new Date();
        var local_time_min = mod((time.getUTCHours() * 60 + time.getUTCMinutes() + near_place.utc_offset_minutes), 1440);
        var local_hours = Math.floor(local_time_min / 60);
        var local_mins = mod(local_time_min, 60);
        alert("Local Time: " + local_hours + ":" + local_mins);
    });

    function enableEnterKey(input) {

        /* Store original event listener */
        const _addEventListener = input.addEventListener;

        const addEventListenerWrapper = (type, listener) => {
            // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
            // and then trigger the original listener.
            if (type == "keydown") {
                var orig_listener = listener;
                listener = function (event) {
                    var suggestion_selected = $(".pac-item-selected").length > 0;
                    if (event.which == 13 && !suggestion_selected) {
                        var simulated_downarrow = $.Event("keydown", {
                            keyCode: 40,
                            which: 40
                        });
                        orig_listener.apply(input, [simulated_downarrow]);
                    }

                    orig_listener.apply(input, [event]);
                };
            }

            _addEventListener.apply(input, [type, listener]);
        }

        input.addEventListener = addEventListenerWrapper;
    }
    var lang_buttons = [document.getElementById("second_lang")
                    , document.getElementById("cur_lang")];
    lang_buttons[0].addEventListener("click", () => {
        var last_src = lang_buttons[0].src;
        lang_buttons[0].src = lang_buttons[1].src;
        lang_buttons[1].src = last_src;
    });
});