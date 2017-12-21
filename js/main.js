$document.ready(function(){
            $('[data-spy="scroll"]').each(function () {
                var $spy = $(this).scrollspy('refresh')
                }); 
        });

$("#video-down").click(function() {
	$("#toggle-section").slideToggle(225);
	img = document.getElementById("img-down");
	if (img.src.indexOf("down") != -1) {
		img.src = "img/up.png";
	} else {
		img.src = "img/down.png";
	}
});