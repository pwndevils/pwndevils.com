//Makes Stack from bootstrap elements

var globalStackObjects = [];
var stackVals = [];
var stackRegs = [];

stackSetup();

function stackSetup() {

    //Gets all x86 stacks
    var stacks = document.getElementsByTagName("stack");

    for (var i = 0; i < stacks.length; i++) {

        //Top dog that houses everything
        var mainRoot = document.createElement("div");
        mainRoot.className += "row";

        //Center Inside Row
        var centerBlock = document.createElement("div");
        centerBlock.className += "col-sm-12 well";
        mainRoot.appendChild(centerBlock);

        //Inside of the block
        var insideContents = document.createElement("div");
        insideContents.className += "conainer-fluid";
        centerBlock.appendChild(insideContents);

        //Set up of row for stack vals and code segment
        var valRow = document.createElement("div");
        valRow.className += "row"
        insideContents.appendChild(valRow);

        //Wraps stack with above and below text
        var stackWrapper = document.createElement("div");
        stackWrapper.className += "col-sm-5 col-sm-offset-2"
        stackWrapper.style.paddingBottom = "40px";
        valRow.appendChild(stackWrapper)

        var stackTopText = document.createElement("p");
        stackTopText.className += "text-center";
        stackTopText.textContent = "0xFFFFFFFF";
        stackTopText.id = "stack-top-text-" + i;
        stackWrapper.appendChild(stackTopText);

        //Col for the actual stack of values
        var stackValCol = document.createElement("div");
        stackValCol.id = "stack-vals-" + i;
        stackWrapper.appendChild(stackValCol);

        var stackBottomText = document.createElement("p");
        stackBottomText.className += "text-center";
        stackBottomText.style.marginTop = "10px";
        stackBottomText.textContent = "0x00000000";
        stackBottomText.id = "stack-bottom-text-" + i;
        stackWrapper.appendChild(stackBottomText);

        //Col for the code
        var codeCol = document.createElement("div");
        codeCol.className += "col-sm-5";
        codeCol.style.marginTop = "35px";
        valRow.appendChild(codeCol);

        //Row for code + button
        var insideCodeRow = document.createElement("div");
        insideCodeRow.className += "row";
        codeCol.appendChild(insideCodeRow);

        //TODO: Add code && button stuff

        //Row for register and values
        var registerRow = document.createElement("div");
        registerRow.className += "row";
        insideContents.appendChild(registerRow);

        //Column for the register and value
        var registerInnerCol = document.createElement("div");
        registerInnerCol.className += "col-sm-5";
        registerRow.appendChild(registerInnerCol);

        var stackObject = { //Keeps track of stack values & current line
            button: null,
            lineNo: 0,
            initLineNo: 0,
            currBlockIdx: 0,
            currBlock: null,
            ebpBlockIdx: 0,
            ebpBlock: document.createElement("div"),
            startAddr: "0x10000",
            segFault: null,
            regs: {},
            regBlocks: {},
            initRegs: {},
            initStackVals: [],
            addedRows: 0
        };

        var regStack = stacks[i].getElementsByTagName("regs")[0].textContent; //Register with Data stacks
        var mainStack = stacks[i].getElementsByTagName("data")[0].textContent; //Main Stack
        var code = stacks[i].getElementsByTagName("pre")[0]; //Main Stack
        //code.style.fontSize = "0.7vw"; //TODO: MAYBE FIX THIS?????

        code.children[0].className += "x86asm"
        stackObject.code = code.children[0];

        //Sets starting point as main:
        var allCode = stackObject.code.textContent.split('\n');
        for (var j = 0; j < allCode.length; j++) {
            if (allCode[j].indexOf("main:") > -1) {
                stackObject.lineNo = j;
                stackObject.initLineNo = j;
                break;
            }
        }

        var allRegVals = regStack.split(","); //Parses all stack values
        for (var j = 0; j < allRegVals.length; j++) {
            var valPair = allRegVals[j].split(":");
            var myReg = valPair[0].trim();
            var myVal = valPair[1].trim();
            if (myVal == "") {
                myVal = "\u00A0";
            }
            stackObject.regs[myReg] = myVal;
            stackObject.initRegs[myReg] = myVal;
            stackObject.regBlocks[myReg] = document.createElement("div");
            if (myReg == "esp") {
                stackObject.startAddr = myVal;
            }
        }

        makeRegStack(registerInnerCol, stackObject); //Makes register/val stacks

        var myStack = makeValStack(mainStack, stackObject); //Makes Main Stack
        stackValCol.appendChild(myStack)
        insideCodeRow.appendChild(code);

        stackObject.currBlock = findStartingBlock(myStack)[0];
        stackObject.currBlockIdx = findStartingBlock(myStack)[1];
        stackObject.ebpBlockIdx = stackObject.currBlockIdx - ((parseInt(stackObject.regs['esp']) - parseInt(stackObject.regs['ebp'])) / 4);

        var myButton = document.createElement("button");
        myButton.type = "button";
        myButton.className = "btn btn-success btn-lg center-block";
        myButton.style.marginBotton = "10px";
        myButton.style.outline = "none";
        myButton.textContent = "Start";
        myButton.id = "stack-button-" + i;

        insideCodeRow.appendChild(myButton);

        var segFaultText = document.createElement("h5");
        segFaultText.className += "text-center";
        segFaultText.style.color = "red";
        insideCodeRow.appendChild(segFaultText);

        stackObject.segFault = segFaultText;
        stackObject.button = myButton;

        //
        globalStackObjects.push(stackObject);
        stackVals.push(myStack);
        stackRegs.push(registerInnerCol);


        myButton.addEventListener('click', function(event) {
            var stackLayoutIdx = event.target.id.split('-')[2];
            var currStackObject = globalStackObjects[stackLayoutIdx];
            var elem = currStackObject.code;
            var currStack = stackVals[stackLayoutIdx];
            var regStack = stackRegs[stackLayoutIdx];

            if ($(this).hasClass('btn-danger')) { //If the Stack has completed
                $(this).removeClass('btn-danger');
                $(this).addClass('btn-success');
                this.textContent = "Start";

                removeHighlight(elem, "highlight", true);

                for (var i = 0; i < currStack.children.length; i++) {
                    removeHighlight(currStack.children[i], "highlight", false);
                    removeHighlight(currStack.children[i], "ebp", false);
                }

                for (key in currStackObject.regBlocks) {
                    removeHighlight(currStackObject.regBlocks[key], "reg", false);
                }


                //Removing any added rows
                var removeBlocks = [];
                for (var i = currStack.children.length - 1; i > currStack.children.length - currStackObject.addedRows - 1; i--) {

                    removeBlocks.push(currStack.children[i]);
                }

                for (var i = 0; i < removeBlocks.length; i++) {
                    currStack.removeChild(removeBlocks[i]);
                }

                currStackObject.segFault.textContent = "";
                currStackObject.addedRows = 0;

                resetRegs(currStackObject, regStack); //Reset Register Values
                resetStackVals(currStackObject, currStack); //Reset Stack Values
                currStackObject.currBlockIdx = 0; //Set initial block to 0
                currStackObject.lineNo = currStackObject.initLineNo; //Reset starting line
            } else {
                this.textContent = "Next";
                var lines = elem.textContent.split('\n');

                if (currStackObject.lineNo < lines.length) { //If we haven't finished executing
                    parseASM(currStackObject, currStack, regStack); //Parse Current Instruction
                    if (currStackObject.lineNo == lines.length - 1) { //If we're the line before the last
                        $(this).removeClass('btn-success');
                        $(this).addClass('btn-danger');
                        this.textContent = "Restart";
                    }
                    currStackObject.lineNo++;
                }
            }
        });

        stacks[i].parentNode.insertBefore(mainRoot, stacks[i]); //Adds everything to document
    }

    for (var i = 0; i < stacks.length; i++) {
        stacks[i].parentNode.removeChild(stacks[i]); //Removes <stack> element
        i--;
    }
}

function makeValStack(data, stackObject) {
    //Main container for stack
    var stackRoot = document.createElement("div");
    stackRoot.className += "container-fluid";

    var vals = data.split(","); //Extracting the values for each stack block
    for (var i = 0; i < vals.length; i++) {
        vals[i] = vals[i].trim();
        if (vals[i] == "") {
            vals[i] = "\u00A0";
        }
        stackObject.initStackVals.push(vals[i]);
    }
    for (var i = 0; i < vals.length; i++) {
        var node = document.createElement("div");
        node.className += "row text-center center-block";
        node.style.outline = "1px solid #D0D0D0"

        var para = document.createElement("p");
        para.style.marginTop = "5%";
        para.style.fontSize = "100%";
        var text = document.createTextNode(vals[i]);
        para.appendChild(text);

        node.appendChild(para);
        stackRoot.appendChild(node);
    }
    return stackRoot;
}

function makeRegStack(elem, stackObject) {

    //Stack for registers
    var regStack = document.createElement("div");
    regStack.style.float = "left";
    regStack.style.display = "inline";
    regStack.style.width = "50%"


    //Stack for Vals
    var valStack = document.createElement("div");
    valStack.style.float = "left";
    valStack.style.display = "inline";
    valStack.style.width = "50%"

    for (key in stackObject.regs) {

        var node = document.createElement("div");
        node.className += "row text-center center-block";
        node.style.outline = "1px solid #D0D0D0"

        var para = document.createElement("p");
        para.style.marginTop = "5%";
        para.style.fontSize = "100%";
        var text = document.createTextNode(stackObject.regs[key]);
        stackObject.regBlocks[key] = node;

        var paraClone = para.cloneNode(true);
        var regText = document.createTextNode(key);

        para.appendChild(text);
        paraClone.appendChild(regText);

        var nodeClone = node.cloneNode(true);

        nodeClone.appendChild(paraClone);
        regStack.appendChild(nodeClone);

        node.appendChild(para);
        valStack.appendChild(node);
    }

    elem.appendChild(regStack);
    elem.appendChild(valStack);
}

function resetRegs(stackObject, regStack) {
    var regVals = regStack.children[1];

    var index = 0;
    for (key in stackObject.initRegs) {
        if (stackObject.initRegs[key] == "") {
            stackObject.initRegs = "\u00A0";
        }
        regVals.children[index].children[0].textContent = stackObject.initRegs[key];
        index++;
    }
}

function resetStackVals(stackObject, currStack) {
    for (var i = 0; i < stackObject.initStackVals.length; i++) {
        currStack.children[i].children[0].textContent = stackObject.initStackVals[i];
    }

}

function relativeUpdate(currStack, stackObject, regName) {
    if (regName === "esp") {
        var updatedIdx = (parseInt(stackObject.regs['esp']) - parseInt(stackObject.regs['ebp'])) / 4;
        stackObject.currBlockIdx = stackObject.ebpBlockIdx - updatedIdx;
        if (stackObject.currBlockIdx >= currStack.children.length) {
            stackObject.addedRows += stackObject.currBlockIdx - currStack.children.length + 1;

            increaseStackSize(currStack, stackObject.currBlockIdx - currStack.children.length + 1);
        }
        stackObject.currBlock = currStack.children[stackObject.currBlockIdx].children[0];
    } else if (regName === "ebp") {
        var updatedIdx = (parseInt(stackObject.regs['ebp']) - parseInt(stackObject.regs['esp'])) / 4;
        stackObject.ebpBlockIdx = stackObject.currBlockIdx - updatedIdx;
        stackObject.ebpBlock = currStack.children[stackObject.ebpBlockIdx].children[0];
    }
}

function removeHighlight(elem, className, isCode) {
    var color = "lightblue";

    if (className === "ebp") {
        color = "yellow";
    }

    if (isCode) {

        var inner = elem.innerHTML.split('\n');
        for (var i = 0; i < inner.length; i++) { //Iterate through all lines
            if (inner[i].indexOf(className) > -1) { //If line contains class name
                inner[i] = inner[i].replace(className, '');
                var matched = inner[i].match('class="(.*?)"')[0].replace('class="', '').trim(); //Get other classes in line;

                if (matched.length > 1) {
                    if (inner[i].match('style="(.*?)"')[0].indexOf("background") > -1) { //If correct style element
                        inner[i] = inner[i].replace(/style="(.*?)"/i, 'style="background: ' + color + ';"');
                    }
                } else {
                    if (inner[i].match('style="(.*?)"')[0].indexOf("background") > -1) {
                        inner[i] = inner[i].replace(/style="(.*?)"/i, 'style="background: none;"');
                    }
                }
            }
        }

        elem.innerHTML = inner.join('\n');
    } else if (className != "reg") {
        try {
            elem.classList.remove(className);
            elem.style.background = color;
            if (!elem.classList.contains("ebp") && !elem.classList.contains("highlight")) {
                elem.style.background = "none";
            }
        } catch (error) {}
    } else {
        elem.style.background = "none";
    }

}

function hasOffset(term) {
    if (term.indexOf('[') > -1) {
        var expr = term.replace('[', '').replace(']', '');
        var offset = 0;
        var reg = "";
        if (expr.indexOf('-') > -1) {
            offset = -parseInt(expr.split('-')[1]);
            reg = expr.split('-')[0];
        } else if (expr.indexOf('+') > -1) {
            offset = parseInt(expr.split('+')[1]);
            reg = expr.split('+')[0];
        }

        return [true, reg, offset];
    }
    return [false];
}

function getStackBlockParent(currStack, stackObject, isEBP) {
    if (isEBP)
        return currStack.children[stackObject.ebpBlockIdx];
    else
        return currStack.children[stackObject.currBlockIdx];
}

function highlightText(elem, lineNum, className, isCode) {
    var color = "yellow";
    if (className === "ebp") {
        color = "lightblue";
    }

    if (isCode) { //If this is from x86 code
        
        var inner = elem.innerHTML.split('\n');
        if (inner[lineNum].indexOf(className) > -1) {
            return;
        }
        


        var found = false;
        if (inner[lineNum].match('style="(.*?)"') != null) { //If it has a style
            found = true;
        }

        if (found) { //Span already exists
            inner[lineNum] = inner[lineNum].replace(/style="(.*?)"/i, 'style="background: ' + color + ';"'); //Replaces Background with updated highlight
            var matched = inner[lineNum].match('class="(.*?)"')[0]; //Gets current classes
            
            matched = matched.substring(0, matched.length - 1) + ' ' + className + '"';

            inner[lineNum] = inner[lineNum].replace(/class="(.*?)"/i, matched); //Replaces classes with updated version;
        } else {
            inner[lineNum] = "<span class='" + className + "' style='background: " + color + "'>" + inner[lineNum] + "</span>"; //Creates span if one doesn't exist
        }

        elem.innerHTML = inner.join('\n');
    } else if (className != "reg") { //If this is for stackVals
        if (elem.classList.contains(className)) {
            return;
        } else {
            elem.classList.add(className);
            elem.style.background = color;
        }
    } else {
        elem.style.background = "lightgreen";
    }

}

function findStartingBlock(currStack) {
    var children = currStack.children;
    var idx = 0;
    var found = false;
    while (!found && idx < children.length - 1) {
        if (children[idx + 1].textContent === "\u00A0") {
            return [children[idx].children[0], idx];
        }
        idx++;
    }
    return [-1];
}

function updateStackObjectBlock(currStack, stackObject) {
    if (stackObject.currBlockIdx >= currStack.children.length) {
        stackObject.addedRows += stackObject.currBlockIdx - currStack.childrenlength + 1;
        increaseStackSize(currStack, stackObject.currBlockIdx - currStack.children.length + 1); //Increase Length to necessary size + 1
    }
    stackObject.currBlock = currStack.children[stackObject.currBlockIdx].children[0];
    if (stackObject.ebpBlockIdx > -1 && stackObject.ebpBlockIdx < currStack.children.length) {
        stackObject.ebpBlock = currStack.children[stackObject.ebpBlockIdx].children[0];
    }
}

function increaseStackSize(currStack, amount) {
    for (var i = 0; i < amount; i++) {
        var node = document.createElement("div");
        node.className += "row text-center center-block";
        node.style.outline = "1px solid #D0D0D0"

        var para = document.createElement("p");
        para.style.marginTop = "5%";
        para.style.fontSize = "100%";
        var text = document.createTextNode("\u00A0");
        para.appendChild(text);

        node.appendChild(para);
        currStack.appendChild(node);
    }
}

//Update a register
function updateRegister(inc, val, regName, stackObject) {
    var regVal = parseInt(stackObject.regs[regName]); //Get current Register val

    if (inc) //If incrementing register val
        regVal += val;
    else //If setting new val for register
        regVal = val;

    stackObject.regs[regName] = "0x" + regVal.toString(16).replace('0x', ''); //Set the new value in stackObject

    stackObject.regBlocks[regName].children[0].textContent = stackObject.regs[regName]; //Set corresponding block text
    for (key in stackObject.regBlocks) {
        if (key.toLowerCase() != "eip") {
            removeHighlight(stackObject.regBlocks[key], "reg", false);
        }
    }
    highlightText(stackObject.regBlocks[regName], 0, "reg", false);
}

//Gets block as an offset of esp or ebp
function getBlock(currVal, regOff, currStack, stackObject) {
    var updateVal = parseInt(currVal); //Current Value of register
    if (regOff.indexOf('-') > -1) { //If we're subtracting from the register
        var offset = parseInt(regOff.replace('[', '').replace(']', '').split('-')[1]);

    } else if (regOff.indexOf('+') > -1) { //If we're adding to the register
        var offset = -parseInt(regOff.replace('[', '').replace(']', '').split('+')[1]);

    } else {
        var offset = 0;
    }

    var blockIdx = offset / 4; //Reducing offset to by word/block

    if (regOff.indexOf("ebp") > -1) { //Get EBP Index
        blockIdx += stackObject.ebpBlockIdx
    } else if (regOff.indexOf("esp") > -1) { //Get ESP Index
        blockIdx += stackObject.currBlockIdx;
    }

    var child = currStack.children[blockIdx].children[0];
    return child;
}

//Parses strcpy
function parseStrCpy(words, currStack, stackObject) {

    var currVal = stackObject.regs['esp'];
    var param1 = stackObject.currBlock;
    var param2 = currStack.children[stackObject.currBlockIdx - 1].children[0];
    var buffAddr = stackObject.regs['eax'];


    if (param2.textContent === "0x8048504") {
        var cseStr = "asu cse 340 fall 2015 rocks!"
        for (var i = 0; i < cseStr.length; i += 4) {
            var subStr = '"' + cseStr.substring(i, i + 4) + '"';
            var blockIdx = stackObject.currBlockIdx - (parseInt(buffAddr) + i - parseInt(stackObject.regs['esp'])) / 4;

            var currBlock = currStack.children[blockIdx].children[0];
            while (currBlock.children.length > 0) {
                currBlock = currBlock.children[currBlock.children.length - 1];
            }
            currBlock.textContent = subStr;
        }
    }
}
//Parses lea instruction
function parseLEA(words, currStack, stackObject) {

    var sourceReg = sourceReg = words[2].replace("[", "").replace("]", "");

    if (words[2].indexOf('-') > -1) {
        sourceReg = sourceReg.split('-');
    } else if (words[2].indexOf('+') > -1) {
        sourceReg = sourceReg.split('+');
    }

    var offset = -1 * parseInt(sourceReg[1]);

    var regAddr = parseInt(stackObject.regs[sourceReg[0]]);
    var offsetAddr = regAddr + offset;
    updateRegister(false, offsetAddr, words[1], stackObject);
}

//Parses leave instruction
function parseLeave(words, currStack, stackObject) {
    parseMov("mov esp ebp".split(" "), currStack, stackObject);
    parsePop("pop ebp".split(" "), currStack, stackObject);
}

//Parses ret instruction
function parseRet(words, currStack, stackObject) {
    if (stackObject.currBlockIdx != 0) {
        var code = stackObject.code.textContent.split('\n');
        parsePop("pop eip".split(" "), currStack, stackObject);

        for (var i = 0; i < code.length; i++) { //Getting line of next instruction
            if (code[i].indexOf(stackObject.regs['eip']) > -1) {
                stackObject.lineNo = i - 1;
                return;
            }
        }
        //If the address in the EIP is not able to be returned within the code segment then segfault.
        stackObject.segFault.innerHTML = ("SEGFAULT: " + stackObject.regs['eip']).bold();
        stackObject.button.textContent = "Restart";
        stackObject.button.classList.remove('btn-success');
        stackObject.button.classList.add('btn-danger');
    }
}

//Parses call to other labels
function parseCall(words, currStack, stackObject) {

    if (words[1] === "strcpy") {
        parseStrCpy(words, currStack, stackObject);
    } else {
        var code = stackObject.code.textContent.split('\n');
        var index = 0;
        var label = 0;

        for (var i = 0; i < code.length; i++) {
            if (code[i].indexOf(words[1]) == 0) { //Look for label
                label = i;
            }
            var text = code[i].trim().split(" "); //Look for next line of code
            if (text[1] === words[1]) {
                index = i + 1;
            }
        }

        var val = parseInt(code[index].replace(" ", "").split(";")[1]);
        updateRegister(false, val, "eip", stackObject);
        parsePush("push eip".split(" "), currStack, stackObject);
        val = parseInt(code[index - 1].replace(" ", "").split(";")[1]);
        updateRegister(false, val, "eip", stackObject);
        stackObject.lineNo = label;
    }
}

//Parses sub instruction
function parseSub(words, currStack, stackObject) {
    //Has offset in one of the arguments
    var reg1Offset = hasOffset(words[1]);
    var reg2Offset = hasOffset(words[2]);

    var isReg1 = (words[1] in stackObject.regs);
    var isReg2 = (words[2] in stackObject.regs);

    if (!reg1Offset[0] && !reg2Offset[0]) {

        var val = 0;
        if (isReg1 && isReg2) {
            val = parseInt(stackObject.regs[words[2]]);
            updateRegister(true, -val, words[1], stackObject);
        } else if (isReg1 && !isReg2) {
            val = parseInt(words[2]);
            updateRegister(true, -val, words[1], stackObject);
        }
        if (words[1] === "esp") {
            removeHighlight(getStackBlockParent(currStack, stackObject, false), "highlight", false);
            relativeUpdate(currStack, stackObject, "esp");
            highlightText(getStackBlockParent(currStack, stackObject, false), 0, "highlight", false);
        }
    } else {
        if (reg1Offset[0] && !reg2Offset[0]) { //TODO THIS
            updateRegister(true, -reg1Offset[2], words[1], stackObject);
            if (words[1] === "esp") {
                removeHighlight(getStackBlockParent(currStack, stackObject, false), "highlight", false);
                relativeUpdate(currStack, stackObject, "esp");
                highlightText(getStackBlockParent(currStack, stackObject, false), 0, "highlight", false);
            }
        }
    }

}

//Parses add instruction
function parseAdd(words, currStack, stackObject) {

    var isOffset = false;
    //Has offset in one of the arguments
    if (words[1].indexOf("[") > -1 || words[2].indexOf("[") > -1) {
        isOffset = true;
    }

    //TODO IF CONTAINS OFFSET NEED TO MAKE SURE TO EXTRACT REG NAME
    var isReg1 = (words[1] in stackObject.regs);
    var isReg2 = (words[2] in stackObject.regs);

    if (!isOffset) { //No Offsets
        if (isReg1 && isReg2) {
            var updateVal = parseInt(stackObject.regs[words[2]]);
            updateRegister(true, updateVal, words[1], stackObject);
        } else if (isReg1 && !isReg2) {
            var updateVal = parseInt(words[2]);
            updateRegister(true, updateVal, words[1], stackObject);
        }
    } else { //One of the arguments contains an offset
        if (words[2].indexOf("[") > -1) { //Offset is in arg2
            isOffset = false;
        }

        if (isOffset) { //Offset in arg2
            if (isReg2) { //Arg2 is a register
                var child = getBlock(stackObject.regs['ebp'], words[1], currStack, stackObject);

                var sum = parseInt(child.textContent) + parseInt(stackObject.regs[words[2]]);
                child.textContent = "0x" + sum.toString(16).replace('0x', '');
            }
        }
    }
}

//parses a mov instruction
function parseMov(words, currStack, stackObject) {
    var isOffset = false;

    if (words[1].indexOf("[") > -1 || words[2].indexOf("[") > -1) { //If any of the arguments are offsets of a register
        isOffset = true;
    }

    var isReg1 = (words[1] in stackObject.regs);
    var isReg2 = (words[2] in stackObject.regs);

    if (!isOffset) {

        if (isReg1 && isReg2) { //If both args are registers
            var updateVal = parseInt(stackObject.regs[words[2]]);
            updateRegister(false, updateVal, words[1], stackObject); //Update Register

            if (words[1] === "ebp") { //If mov updates EBP
                removeHighlight(getStackBlockParent(currStack, stackObject, true), "ebp", false);
                relativeUpdate(currStack, stackObject, "ebp");
                highlightText(getStackBlockParent(currStack, stackObject, true), 0, "ebp", false);
            } else if (words[1] === "esp") { //If mov updates ESP
                removeHighlight(getStackBlockParent(currStack, stackObject, false), "highlight", false);
                relativeUpdate(currStack, stackObject, "esp");

                highlightText(getStackBlockParent(currStack, stackObject, false), 0, "highlight", false);
            }

        } else if (isReg1 && !isReg2) { //If the first arg is a register and the second is a constant
            var updateVal = parseInt(words[2]);
            updateRegister(false, updateVal, words[1], stackObject);

        } else if (!isReg1 && isReg2) { //How would I even do this?
        }
    } else {
        if (words[2].indexOf("[") > -1) { //If the second argument is an offset
            isOffset = false;
        }

        if (isOffset) { //Has offset in first argument
            if (words[1].indexOf("ebp") > -1) { //If offset of EBP
                var child = getBlock(stackObject.regs['ebp'], words[1], currStack, stackObject); //Get offset block
                if (isReg2) {
                    child.textContent = stackObject.regs[words[2]];
                } else {
                    child.textContent = words[2];
                }
            } else if (words[1].indexOf("esp") > -1) { //If offset of ESP
                var child = getBlock(stackObject.regs['esp'], words[1], currStack, stackObject);
                if (isReg2) {
                    child.textContent = stackObject.regs[words[2]];
                } else {
                    child.textContent = words[2];
                }
                if (words[1].indexOf('+') < 0 && words[1].indexOf('-') < 0) { //Offset is 0
                    highlightText(child.parentNode, 0, "highlight", false);
                }
            }
        } else {
            if (words[2].indexOf("ebp") > -1) {
                var child = getBlock(stackObject.regs['ebp'], words[2], currStack, stackObject);
            } else if (words[2].indexOf("esp") > -1) {
                var child = getBlock(stackObject.regs['esp'], words[2], currStack, stackObject);
            }
            if (isReg1) {
                var updateVal = parseInt(child.textContent);
                updateRegister(false, updateVal, words[1], stackObject);
            }
        }
    }
}

//parses a push instruction
function parsePush(words, currStack, stackObject) {
    //Update Stack Object
    stackObject.currBlockIdx++;
    updateStackObjectBlock(currStack, stackObject);

    var elem = stackObject.currBlock; //Get current stack block
    if (elem != -1) {
        if (words[1] in stackObject.regs) { //If it's a register
            elem.textContent = stackObject.regs[words[1]]; //Set block to register value
        } else {
            elem.textContent = words[1]; //Immediate value
        }
        if (stackObject.currBlockIdx > 0) { //CurrStackBlock not 0
            var prevElem = currStack.children[stackObject.currBlockIdx - 1]; //Previous Stack Element
            removeHighlight(prevElem, "highlight", false); //Remove highlight from that elem
        }
        highlightText(getStackBlockParent(currStack, stackObject, false), 0, "highlight", false); //Highlight current

        updateRegister(true, -4, "esp", stackObject); //Decrement ESP
    }
}

//parses a pop instruction
function parsePop(words, currStack, stackObject) {

    var elem = stackObject.currBlock; //Get current block
    var updateVal = parseInt(elem.textContent); //Get val in block

    if (words[1] in stackObject.regs) { //Arg 1 is Register
        if (isNaN(updateVal)) { //If ??????
            var tempStr = "0x";
            for (var i = elem.textContent.length - 1; i > 1; i--) {
                tempStr += elem.textContent.charCodeAt(i).toString(16);
            }
            updateVal = parseInt(tempStr);
        }

        updateRegister(false, updateVal, words[1], stackObject); //Set Register
        elem.textContent = "\u00A0"; //Replace empty spot with empty space

        stackObject.currBlock = elem;
    }

    if (stackObject.currBlockIdx > 0) { //Remove highlight of currElem
        removeHighlight(getStackBlockParent(currStack, stackObject, false), "highlight", false);
    }
    var prevElem = currStack.children[stackObject.currBlockIdx - 1]; //Get prev elem to highlight
    highlightText(prevElem, 0, "highlight", false);

    if (words[1] === "ebp") { //If EBP, do all the necessary highlight stuff
        removeHighlight(getStackBlockParent(currStack, stackObject, false), "ebp", false);
        try { //Update Highlighting and stack Object
            relativeUpdate(currStack, stackObject, "ebp");
            highlightText(getStackBlockParent(currStack, stackObject, true), 0, "ebp", false);
        } catch (err) {}
    } else if (words[1] === "esp") {
        removeHighlight(getStackBlockParent(currStack, stackObject, false), "esp", false);
        try { //Update Highlighting and stack Object
            relativeUpdate(currStack, stackObject, "esp");
            highlightText(getStackBlockParent(currStack, stackObject, false), 0, "highlight", false);
        } catch (err) {}
        //Counteract the updating that'll always happen at the end. Bad practice but ¯\_(ツ)_/¯
        updateRegister(true, -4, "esp", stackObject);
        stackObject.currBlockIdx++;
    }

    updateRegister(true, 4, "esp", stackObject);
    currStack.currBlock = elem;

    stackObject.currBlockIdx--;
    updateStackObjectBlock(currStack, stackObject);

}

//This is the parser for the x86 Stack
function parseASM(stackObject, currStack, regStack) {
    var keywords = ["mov", "push", "pop", "movl", "sub", "add", "call", "ret", "leave", "lea"]; //Supported x86 Instructions
    var elem = stackObject.code;
    removeHighlight(elem, "highlight", true); //Remove highlight of previous line
    highlightText(elem, stackObject.lineNo, "highlight", true); //Highlight current line
    var line = stackObject.code.textContent.split("\n")[stackObject.lineNo];
    var line = line.replace(",", "");
    var words = line.trim().split(" ");
    if (line.indexOf(";") > -1) {
        var addr = parseInt(line.split(";")[1].replace(" ", ""));
        updateRegister(false, addr, "eip", stackObject);
    }

    updateStackObjectBlock(currStack, stackObject);
    switch (keywords.indexOf(words[0])) {
        case 0:
            parseMov(words, currStack, stackObject);
            break;
        case 1:
            parsePush(words, currStack, stackObject);
            break;
        case 2:
            parsePop(words, currStack, stackObject);
            break;
        case 3:
            parseMov(words, currStack, stackObject);
            break;
        case 4:
            parseSub(words, currStack, stackObject);
            break;
        case 5:
            parseAdd(words, currStack, stackObject);
            break;
        case 6:
            parseCall(words, currStack, stackObject);
            break;
        case 7:
            parseRet(words, currStack, stackObject);
            break;
        case 8:
            parseLeave(words, currStack, stackObject);
            break;
        case 9:
            parseLEA(words, currStack, stackObject);
            break;
    }
}