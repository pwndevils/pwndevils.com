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

$("#stack-test-button").click(function() {
    var elem = document.getElementById("stack-example-asm");
    var currStack = document.getElementById("main-ex-stack");
    var regStack = document.getElementById("register-ex-stack");

    if ($(this).hasClass('btn-danger')) {
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        this.textContent = "Start";

        removeHighlight(elem, "highlight");
        removeHighlight(currStack, "highlight");
        regStack.children[1].children[1].children[0].textContent = " ";

    } else {
        this.textContent = "Next";
        var lines = elem.textContent.split('\n');
        var currLine = getLineNumber(elem)[0];

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

$("#local-var-test-button").click(function() {
    var elem = document.getElementById("local-var-ex-asm");
    var currStack = document.getElementById("local-var-ex-stack");
    var regStack = document.getElementById("register-local-ex-stack");

    if ($(this).hasClass('btn-danger')) {
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        this.textContent = "Start";

        removeHighlight(elem, "highlight");
        removeHighlight(currStack, "highlight");

        removeHighlight(currStack, "ebp");
        regStack.children[1].children[0].children[0].textContent = " ";
        regStack.children[1].children[1].children[0].textContent = "0x10000";
        regStack.children[1].children[2].children[0].textContent = " ";
        currStack.children[1].children[0].textContent = " ";
        currStack.children[2].children[0].textContent = " ";
        currStack.children[3].children[0].textContent = " ";

    } else {
        this.textContent = "Next";
        var lines = elem.textContent.split('\n');
        var currLine = getLineNumber(elem)[0];

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

$("#call-conv-test-button").click(function() {
    var elem = document.getElementById("call-conv-ex-asm");
    var currStack = document.getElementById("call-conv-ex-stack");
    var regStack = document.getElementById("register-call-conv-ex-stack");

    if ($(this).hasClass('btn-danger')) {
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        this.textContent = "Start";

        removeHighlight(elem, "highlight");
        removeHighlight(currStack, "highlight");

        removeHighlight(currStack, "ebp");
        regStack.children[1].children[0].children[0].textContent = " ";
        regStack.children[1].children[1].children[0].textContent = " ";
        regStack.children[1].children[2].children[0].textContent = "0x10004";
        regStack.children[1].children[3].children[0].textContent = "0x100a0";
        regStack.children[1].children[4].children[0].textContent = "0x80483a5";
        for (var i = 0; i < currStack.children.length; i++) {
            currStack.children[i].children[0].textContent = " ";
        }

    } else {
        this.textContent = "Next";
        var lines = elem.textContent.split('\n');
        var result = getLineNumber(elem);
        var currLine = result[0];

        if (currLine == 0 && !result[1]) {
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("main:") > -1) {
                    currLine = i + 1;
                    break;
                }
            }
        }
        if (lines[currLine - 1].indexOf("call") > -1) {
            currLine = 1;
        }
        if (lines[currLine - 1].indexOf("ret") > -1) {
            var result = parseRegStack(regStack);

            var regs = result[0];
            var vals = result[1];
            var ebp = vals[regs.indexOf("eip")];
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf(":") < 0) {
                    var addr = (lines[i].split(";")[1]);
                    if (addr === ebp) {
                        currLine = i;
                        break;
                    }
                }
            }
        }

        if (currLine < lines.length) {
            if (currLine != lines.length - 1 || lines[currLine].indexOf("ret") < 0) {
                parseASM(lines[currLine], currLine, elem, currStack, regStack);
            } else {
                removeHighlight(elem, "highlight");
                highlightText(elem, currLine, "highlight");
            }

            if (currLine == lines.length - 1) {
                $(this).removeClass('btn-success');
                $(this).addClass('btn-danger');
                this.textContent = "Restart";
            }
        }
    }
});

$("#overflow-test-button").click(function() {
    var elem = document.getElementById("overflow-ex-asm");
    var currStack = document.getElementById("overflow-ex-stack");
    var regStack = document.getElementById("register-overflow-ex-stack");
    var segText = document.getElementById("segfault-overflow");

    if (!segText.classList.contains("hidden"))
        segText.classList.add("hidden");
    if ($(this).hasClass('btn-danger')) {
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        this.textContent = "Start";

        removeHighlight(elem, "highlight");
        removeHighlight(currStack, "highlight");

        removeHighlight(currStack, "ebp");
        regStack.children[1].children[0].children[0].textContent = " ";
        regStack.children[1].children[1].children[0].textContent = "0x10004";
        regStack.children[1].children[2].children[0].textContent = "0x100a0";
        regStack.children[1].children[3].children[0].textContent = "0x804840e";
        for (var i = 0; i < currStack.children.length; i++) {
            currStack.children[i].children[0].textContent = " ";
        }
    } else {
        this.textContent = "Next";
        var lines = elem.textContent.split('\n');
        var result = getLineNumber(elem);
        var currLine = result[0];

        if (currLine == 0 && !result[1]) {
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("main:") > -1) {
                    currLine = i + 1;
                    break;
                }
            }
        }
        if (lines[currLine - 1].indexOf("call") > -1 && lines[currLine - 1].indexOf("strcpy") < 0) {
            currLine = 1;
        }
        if (lines[currLine - 1].indexOf("ret") > -1) {
            var result = parseRegStack(regStack);

            var regs = result[0];
            var vals = result[1];
            var ebp = vals[regs.indexOf("eip")];
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf(":") < 0) {
                    var addr = (lines[i].split(";")[1]);
                    if (addr === ebp) {
                        currLine = i;
                        break;
                    }
                }
            }
        }

        if (currLine < lines.length) {
            if (lines[currLine - 1].indexOf("ret") < 0) {
                parseASM(lines[currLine], currLine, elem, currStack, regStack);
            } else {
                $(this).removeClass('btn-success');
                $(this).addClass('btn-danger');
                this.textContent = "Restart";
                segText.classList.remove("hidden");

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
            return [i + 1, true];
        }
    }
    return [0, false];
}


function removeHighlight(elem, className) {
    var inner = elem.innerHTML;
    elem.innerHTML = inner.replace('class="' + className + '"', 'class="no' + className + '"');
}

function highlightText(elem, lineNum, className) {
    var inner = elem.innerHTML.split('\n');
    if (inner[lineNum].substring(0, 26) === '<span class="no' + className + '">') {
        inner[lineNum] = inner[lineNum].replace("no" + className, className);
    } else {
        inner[lineNum] = "<span class='" + className + "'>" + inner[lineNum] + "</span>";
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
        pVals[regIdx].textContent = "0x" + regVal.toString(16).replace('0x', '');
    }

}


function getBlock(currVal, ref, currStack) {
    var updateVal = parseInt(currVal);
    if (ref.indexOf('-') > -1) {
        var offset = parseInt(ref.replace('[', '').replace(']', '').split('-')[1]);

    } else {
        var offset = -1 * parseInt(ref.replace('[', '').replace(']', '').split('+')[1]);

    }
    var idx = (0x10000 - (updateVal - offset)) / 4;


    var child = currStack.children[idx].children[0];
    return child;
}

function parseStrCpy(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];
    var currVal = vals[regs.indexOf("esp")];
    var param1 = getBlock(currVal, "esp+0", currStack);
    var param2 = getBlock(currVal, "esp+4", currStack);
    var buffAddr = vals[regs.indexOf("eax")];


    if (param2.textContent === "0x8048504") {
        var cseStr = "asu cse 340 fall 2015 rocks!"
        for (var i = 0; i < cseStr.length; i += 4) {
            var subStr = '"' + cseStr.substring(i, i + 4) + '"';
            var currBlock = getBlock(buffAddr, "esp+" + i, currStack);
            while (currBlock.children.length > 0) {
                currBlock = currBlock.children[currBlock.children.length - 1];
            }
            currBlock.textContent = subStr;
        }
    }
}

function parseLEA(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];

    var sourceReg = words[2].replace("[", "").replace("]", "").split("-");
    var offset = -1 * parseInt(sourceReg[1]);

    var regAddr = parseInt(vals[regs.indexOf(sourceReg[0])]);
    var offsetAddr = regAddr + offset;
    updateRegister(regStack, false, offsetAddr, words[1]);
}

function parseLeave(words, currStack, regStack) {
    parseMov("mov esp ebp".split(" "), currStack, regStack);
    parsePop("pop ebp".split(" "), currStack, regStack);
}

function parseRet(words, currStack, regStack, elem) {
    var code = elem.textContent.split('\n');
    parsePop("pop eip".split(" "), currStack, regStack);
}

function parseCall(words, currStack, regStack, elem) {

    if (words[1] === "strcpy") {
        parseStrCpy(words, currStack, regStack);
    } else {
        var code = elem.textContent.split('\n');
        var index = 0;
        var label = 0;
        for (var i = 0; i < code.length; i++) {
            if (code[i].indexOf(words[1]) == 0) {
                label = i;
            }
            var text = code[i].trim().split(" ");
            if (text[1] === words[1]) {
                index = i + 1;
            }
        }
        var val = parseInt(code[index].replace(" ", "").split(";")[1]);
        updateRegister(regStack, false, val, "eip");
        parsePush("push eip".split(" "), currStack, regStack);
        val = parseInt(code[index - 1].replace(" ", "").split(";")[1]);
        updateRegister(regStack, false, val, "eip");
    }
}

function parseSub(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];

    var regIdx = regs.indexOf(words[1]);
    var val = parseInt(words[2]);

    if (regIdx > -1) {
        updateRegister(regStack, true, -val, regs[regIdx]);
        if (regs[regIdx] === "esp") {
            removeHighlight(currStack, "highlight");
            var updateVal = vals[regIdx] - val;
            var idx = (0x10000 - updateVal) / 4;
            var child = currStack.children[idx].children[0];
            highlightText(child, 0, "highlight");
        }
    }

}

function parseAdd(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];
    var isOffset = false;

    if (words[1].indexOf("[") > -1 || words[2].indexOf("[") > -1) {
        isOffset = true;
    }
    var reg1Idx = regs.indexOf(words[1]);
    var reg2Idx = regs.indexOf(words[2]);

    if (!isOffset) {
        if (reg1Idx > -1 && reg2Idx > -1) {
            var updateVal = parseInt(vals[reg2Idx]);
            updateRegister(regStack, true, updateVal, regs[reg1Idx]);
        } else if (reg1Idx > -1 && reg2Idx < 0) {
            var updateVal = parseInt(words[2]);
            updateRegister(regStack, true, updateVal, regs[reg1Idx]);
        }
    } else {
        if (words[2].indexOf("[") > -1) {
            isOffset = false;
        }
        if (isOffset) {
            if (reg2Idx > -1) {
                var child = getBlock(vals[regs.indexOf("ebp")], words[1], currStack);

                var sum = parseInt(child.textContent) + parseInt(vals[reg2Idx]);
                child.textContent = "0x" + sum.toString(16).replace('0x', '');
            }
        }
    }
}

//parses a mov instruction
function parseMov(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];
    var isOffset = false;

    if (words[1].indexOf("[") > -1 || words[2].indexOf("[") > -1) {
        isOffset = true;
    }
    var reg1Idx = regs.indexOf(words[1]);
    var reg2Idx = regs.indexOf(words[2]);

    if (!isOffset) {

        if (reg1Idx > -1 && reg2Idx > -1) {
            var updateVal = parseInt(vals[reg2Idx]);
            updateRegister(regStack, false, updateVal, regs[reg1Idx]);
            if (words[1] === "ebp") {
                removeHighlight(currStack, "ebp");
                var idx = (0x10000 - updateVal) / 4;
                var child = currStack.children[idx].children[0];

                highlightText(child, 0, "ebp");
            } else if (words[1] === "esp") {
                removeHighlight(currStack, "highlight");
                var idx = (0x10000 - updateVal) / 4;
                var child = currStack.children[idx].children[0];

                highlightText(child, 0, "highlight");
            }

        } else if (reg1Idx > -1 && reg2Idx < 0) {
            var updateVal = parseInt(words[2]);
            updateRegister(regStack, false, updateVal, regs[reg1Idx]);

        } else if (reg1Idx < 0 && reg2Idx > -1) {

        }
    } else {
        if (words[2].indexOf("[") > -1) {
            isOffset = false;
        }

        if (isOffset) {
            if (words[1].indexOf("ebp") > -1) {
                var child = getBlock(vals[regs.indexOf("ebp")], words[1], currStack);
                var sum = parseInt
                if (reg2Idx > -1) {
                    child.textContent = vals[reg2Idx];
                } else {
                    child.textContent = words[2];
                }
            } else if (words[1].indexOf("esp") > -1) {
                var child = getBlock(vals[regs.indexOf("esp")], words[1], currStack);
                var sum = parseInt
                if (reg2Idx > -1) {
                    child.textContent = vals[reg2Idx];
                    var ref = parseInt(words[1].replace('[', '').replace(']', '').split('+')[1]);
                    if (ref == 0) {
                        highlightText(child, 0, "highlight");
                    }
                } else {
                    child.textContent = words[2];
                    var ref = parseInt(words[1].replace('[', '').replace(']', '').split('+')[1]);
                    if (ref == 0) {
                        highlightText(child, 0, "highlight");
                    }
                }
            }
        } else {
            if (words[2].indexOf("ebp") > -1) {
                var child = getBlock(vals[regs.indexOf("ebp")], words[2], currStack);
                if (reg1Idx > -1) {
                    updateVal = parseInt(child.textContent);
                    updateRegister(regStack, false, updateVal, words[1]);
                }
            } else if (words[2].indexOf("esp") > -1) {
                var child = getBlock(vals[regs.indexOf("esp")], words[2], currStack);
                if (reg1Idx > -1) {
                    updateVal = parseInt(child.textContent);
                    updateRegister(regStack, false, updateVal, words[1]);
                }
            }
        }
    }
}

//parses a push instruction
function parsePush(words, currStack, regStack) {
    var result = parseRegStack(regStack);

    var regs = result[0];
    var vals = result[1];

    var idx = regs.indexOf(words[1]);
    var stackVals = findCurrStackBlock(currStack);
    var elem = getBlock(vals[regs.indexOf("esp")], "esp-4", currStack);
    //var elem = stackVals[0];
    if (elem != -1) {
        if (idx > -1) {
            elem.textContent = vals[idx];
        } else {
            elem.textContent = words[1];
        }
        if (stackVals.length > 1) {
            var prevElem = getBlock(vals[regs.indexOf("esp")], "esp+0", currStack);
            removeHighlight(prevElem, "highlight");
        }
        highlightText(elem, 0, "highlight");

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
    var elem = getBlock(vals[regs.indexOf("esp")], "esp+0", currStack);
    //var elem = stackVals[1];

    if (elem != -1) {
        var updateVal = parseInt(elem.textContent);

        if (idx > -1) {
            if (isNaN(updateVal)) {
                var tempStr = "0x"
                for (var i = elem.textContent.length - 1; i > 1; i--) {
                    tempStr += elem.textContent.charCodeAt(i).toString(16);
                }
                updateVal = parseInt(tempStr);
            }
            updateRegister(regStack, false, updateVal, regs[idx])
            elem.textContent = " ";
        }

        if (stackVals.length > 1) {
            removeHighlight(elem, "highlight");
        }
        var prevElem = getBlock(vals[regs.indexOf("esp")], "esp+4", currStack);
        highlightText(prevElem, 0, "highlight");

        if (regs[idx] === "ebp") {
            removeHighlight(elem, "ebp");
            try {
                var newElem = getBlock(updateVal, "ebp+0", currStack);
                highlightText(newElem, 0, "ebp");
            } catch (err) {}
        }

        updateRegister(regStack, true, 4, "esp");
    }
}

//This is the parser for the x86 Stack
function parseASM(line, lineNum, elem, currStack, regStack) {
    var keywords = ["mov", "push", "pop", "movl", "sub", "add", "call", "ret", "leave", "lea"];
    removeHighlight(elem, "highlight");
    highlightText(elem, lineNum, "highlight");
    var line = line.replace(",", "");
    var words = line.trim().split(" ");
    if (line.indexOf(";") > -1) {
        var addr = parseInt(line.split(";")[1].replace(" ", ""));
        updateRegister(regStack, false, addr, "eip")
    }

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
        case 3:
            parseMov(words, currStack, regStack);
            break;
        case 4:
            parseSub(words, currStack, regStack);
            break;
        case 5:
            parseAdd(words, currStack, regStack);
            break;
        case 6:
            parseCall(words, currStack, regStack, elem);
            break;
        case 7:
            parseRet(words, currStack, regStack, elem);
            break;
        case 8:
            parseLeave(words, currStack, regStack);
            break;
        case 9:
            parseLEA(words, currStack, regStack);
            break;
    }
}