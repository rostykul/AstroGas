var scroll_el = document.getElementById("scrolling");

window.addEventListener("scroll", () => {
    scroll_el.style.setProperty("--scroll", window.pageYOffset);
    //alert("value: " + window.pageYOffset);
});
//scroll_el.style.setProperty("margin", "50px");