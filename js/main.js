$("#video-down").click(function() {
    $("#toggle-section").slideToggle(225);


    img = document.getElementById("img-down");
    if (img.src.indexOf("down") != -1) {
        img.src = "img/up.png";
    } else {
        img.src = "img/down.png";
    }
});

$("#banner-img")
    .on('load', function() { handler(); })
    .on('error', function() { console.log("error loading image"); })
    .attr("src", $("#banner-img").attr("src"))
;

var banner = $("#banner-img");
if (banner.complete) {
    // Already loaded, call the handler directly
	console.log("Calling Loader");
    handler();
}
else {
	console.log("Added to loader");
    // Not loaded yet, register the handler
    banner.onload = handler;
}
function handler() {
	$('body').toggleClass('loaded');
}

$(".nav li a").on('click', function(event) {


    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {

        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top - (window.innerHeight / 20)
        }, 400, function() {
        	
            // Add hash (#) to URL when done scrolling (default click behavior)
            //window.location.hash = hash;
        });
    }
});

