var scroll_el = document.getElementById("scrolling");

window.addEventListener("scroll", () => {
    scroll_el.style.setProperty("--scroll", window.pageYOffset);
    //alert("value: " + window.pageYOffset);
});
//scroll_el.style.setProperty("margin", "50px");
var time_input = document.getElementById("time");
var loc_result = document.getElementById("loc_result");

time_input.addEventListener("input", () => {
    call_my_info(time_input.value);
    
    // if (time_input.value == "2019") {
    //     loc_result.style.setProperty("display", "grid");
    // }else {
    //     loc_result.style.setProperty("display", "none");
    // }
    //alert("value: " + window.pageYOffset);
    //spook
});
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function setResult(data){
    //clear
    loc_result.style.setProperty("display", "none");
    sleep(100).then(() => {
        var range = document.createRange();
        range.selectNodeContents(loc_result);
        range.deleteContents();
        for(i in data){
            let cur_row = data[i];
            if (cur_row.ImageHeader == null){
                let cur_div = document.createElement('div');
                let label = document.createElement('p');
                label.textContent = cur_row.LabelEnglish + ':';
                console.log(`${i} : ${cur_row.LabelEnglish}`);
                label.setAttribute('class', 'result_col1');
                let value = document.createElement('p');
                value.textContent = cur_row.ValueEnglish;
                value.setAttribute('class', 'result_col2');
                cur_div.append(label);
                cur_div.append(value);
                loc_result.append(cur_div);
            }else {
                let cur_img = document.createElement('img');
                cur_img.setAttribute('src', `data:image/png;base64,${cur_row.ImageHeader}`);
                loc_result.append(cur_img);
            }
        }
        console.log(data.length);
        loc_result.style.setProperty('--result_height', `${data.length*90}px`);
        loc_result.style.setProperty("display", "flex");
    });
}

function call_my_info(my_date){
    var myHeaders = new Headers();
    myHeaders.append("my_date", my_date);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("https://192.168.26.19:3000/api/my_info", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        setResult(result);
    })
    .catch(err=>console.error(err));
}
// time_input.addEventListener("blur", () => {
//     loc_result.style.setProperty("display", "none");
//     //alert("value: " + window.pageYOffset);
// });
//AutoFill Google Script
function mod(n, m) {
    return ((n % m) + m) % m;
}
function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}
function doubleTime(time){
    var str_time = time + '';
    if (str_time.length < 2) {
        str_time = '0' + str_time;
    }
    return str_time;
}
$(document).ready(function () {
    var pac_input = document.getElementById('location');
    var autocomplete = new google.maps.places.Autocomplete(pac_input, {
        types: ['geocode']
    });
    enableEnterKey(pac_input);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
        // document.getElementById('latitude_view').textContent = near_place.geometry.location.lat();
        // document.getElementById('longitude_view').textContent = near_place.geometry.location.lng();
        var time = new Date();
        var local_time_min = (time.getUTCHours() * 60 + time.getUTCMinutes() + near_place.utc_offset_minutes);
        if(local_time_min < 0) {
            time = addDays(time, -1) ;
        } else if (mod(local_time_min, 1440) != local_time_min) {
            time = addDays(time, 1) ;
        }
        local_time_min = mod(local_time_min, 1440);
        var local_hours = Math.floor(local_time_min / 60);
        var local_mins = mod(local_time_min, 60);
        // alert("Local Time: " + local_hours + ":" + local_mins);
        // alert(`${time.getUTCFullYear()}-${doubleTime(time.getUTCMonth() + 1)}-${doubleTime(time.getUTCDate())} ${doubleTime(local_hours)}:${doubleTime(local_mins)}`);
        let my_date = `${time.getUTCFullYear()}-${doubleTime(time.getUTCMonth() + 1)}-${doubleTime(time.getUTCDate())} ${doubleTime(local_hours)}:${doubleTime(local_mins)}`;
        time_input.value = my_date;
        call_my_info(my_date);
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