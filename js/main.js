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
        para.style.marginTop = "10%";
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

$("#stack-test-button").click(function() {
    var elem = document.getElementById("stack-example-asm");
    var currStack = document.getElementById("main-ex-stack");
    var regStack = document.getElementById("register-ex-stack");

    if ($(this).hasClass('btn-danger')) {
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        this.textContent = "Start";
        console.log(elem);

        removeHighlight(elem);
        removeHighlight(currStack);
        regStack.children[1].children[1].children[0].textContent = " ";

    } else {
        this.textContent = "Next";
        var lines = elem.textContent.split('\n');
        var currLine = getLineNumber(elem);

        if (currLine < lines.length) {
            parseASM(lines[currLine], currLine, elem, currStack, regStack);
            if (currLine == lines.length - 1) {
                $(this).removeClass('btn-success');
                $(this).addClass('btn-danger');
                this.textContent = "Restart";
            }
        }
    }
});



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
$(".nav li a").on('click', function(event) {


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
        console.log(this.hash);

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

function getLineNumber(code) {
    inner = code.innerHTML.split('\n');
    for (var i = 0; i < inner.length; i++) {
        if (inner[i].indexOf('class="highlight"') > -1) {
            return i + 1;
        }
    }
    return 0;
}


function removeHighlight(elem) {
    var inner = elem.innerHTML;
    elem.innerHTML = inner.replace('class="highlight"', 'class="nohighlight"');
    console.log(inner);
}

function highlightText(elem, lineNum) {
    var inner = elem.innerHTML.split('\n');
    if (inner[lineNum].substring(0, 26) === '<span class="nohighlight">') {
        inner[lineNum] = inner[lineNum].replace("nohighlight", "highlight");
    } else {
        inner[lineNum] = "<span class='highlight'>" + inner[lineNum] + "</span>";
    }
    elem.innerHTML = inner.join('\n');

}

function parseRegStack(regStack) {
    var children = regStack.children;
    var regs = children[0].children;
    var vals = children[1].children;

    var returnRegs = [];
    var returnVals = [];

    for (var i = 0; i < regs.length; i++) {
        returnRegs.push(regs[i].textContent);
        returnVals.push(vals[i].textContent);
    }

    return [returnRegs, returnVals];
}

function findCurrStackBlock(currStack) {
    var children = currStack.children;
    var idx = 0;
    var found = false;
    while (!found && idx < children.length) {
        if (children[idx].textContent === " ") {
            if (idx > 0) {
                return [children[idx].children[0], children[idx - 1].children[0]];
            }
            return [children[idx].children[0]];
        }
        idx++;
    }
    return [-1];
}

function updateRegister(regStack, inc, val, regName) {
    var regs = regStack.children[0].children;
    var vals = regStack.children[1].children;
    var pVals = [];

    var text = [];

    for (var i = 0; i < regs.length; i++) {
        text.push(regs[i].textContent);
        pVals.push(vals[i].children[0]);
    }

    var regIdx = text.indexOf(regName);
    if (regIdx > -1) {
        var regVal = parseInt(vals[regIdx].textContent);
        if (inc)
            regVal += val;
        else
            regVal = val;
        pVals[regIdx].textContent = "0x" + regVal.toString(16);
    }

}

//parses a mov instruction
function parseMov(words, currStack, regStack) {
    return 0;
}

//parses a push instruction
function parsePush(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];

    var idx = regs.indexOf(words[1]);
    var stackVals = findCurrStackBlock(currStack);
    var elem = stackVals[0];
    if (elem != -1) {
        if (idx > -1) {
            elem.textContent = vals[idx];
        } else {
            elem.textContent = words[1];
        }
        if (stackVals.length > 1) {
            removeHighlight(stackVals[1]);
        }
        highlightText(elem, 0);

        updateRegister(regStack, true, -4, "esp");
    }
}

//parses a pop instruction
function parsePop(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];

    var idx = regs.indexOf(words[1]);
    var stackVals = findCurrStackBlock(currStack);
    var elem = stackVals[1];
    if (elem != -1) {
        if (idx > -1) {
            var updateVal = parseInt(elem.textContent);
            console.log(vals[idx]);
            updateRegister(regStack, false, updateVal, "ebx")
            elem.textContent = " ";
        }

        if (stackVals.length > 1) {
            removeHighlight(elem);
        }
        stackVals = findCurrStackBlock(currStack);
        highlightText(stackVals[1], 0);

        updateRegister(regStack, true, 4, "esp");
    }
}

//This is the parser for the x86 Stack
function parseASM(line, lineNum, elem, currStack, regStack) {
    var keywords = ["mov", "push", "pop"];
    removeHighlight(elem);
    highlightText(elem, lineNum);
    var line = line.replace(",", "");
    var words = line.split(" ");
    switch (keywords.indexOf(words[0])) {
        case 0:
            parseMov(words, currStack, regStack);
            break;
        case 1:
            parsePush(words, currStack, regStack);
            break;
        case 2:
            parsePop(words, currStack, regStack);
            break;
    }
}

/*  This gets all code examples.
allCode = $('code').map(function(){
  return $(this).text();
}).get();*/