var currStackLine = 0;
//Expand/Collapse Video section and changes corresponding image
$("#video-down").click(function() {
    $("#toggle-section").slideToggle(225);


    img = document.getElementById("img-down");
    if (img.src.indexOf("down") != -1) {
        img.src = "img/up.png";
    } else {
        img.src = "img/down.png";
    }
});

//Makes Stack from bootstrap elements
function makeStack(elem) {
    var stackRoot = elem;
    var vals = stackRoot.textContent.split(" ");
    stackRoot.textContent = "";

    for (i = 0; i < vals.length; i++) {
        var node = document.createElement("div");
        node.className += "row text-center center-block border";

        var para = document.createElement("p");
        para.style.marginTop = "5%";
        para.style.fontSize = "100%";
        var text = document.createTextNode(vals[i]);
        para.appendChild(text);

        node.appendChild(para);
        stackRoot.appendChild(node);
    }
}

function stackSetup() {

    var stacks = document.getElementsByClassName("stack-loc");

    for (h = 0; h < stacks.length; h++) {
        makeStack(stacks[h]);
    }
}

stackSetup();

//Adds loader to image
$("#banner-img")
    .on('load', function() { handler(); })
    .on('error', function() { console.log("error loading image"); })
    .attr("src", $("#banner-img").attr("src"));


//Checking if image is loaded
var banner = $("#banner-img");
if (banner.complete) {
    // Already loaded, call the handler directly
    console.log("Calling Loader");
    handler();
} else {
    console.log("Added to loader");
    // Not loaded yet, register the handler
    banner.onload = handler;
}

//Closes loading animation
function handler() {
    $('body').toggleClass('loaded');
}

//AutoScrolling when clicking on nav-bar

$("a").on('click', function(event) {


    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {

        // Prevent default anchor click behavior
        event.preventDefault();
        if (this.href.split("#")[0].indexOf($(location).attr('href').split("#")[0]) <= -1) {
            window.location = this.href;
            //$('html').scrollTop = $(hash).offset.top - (window.innerHeight / 20);
        }

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