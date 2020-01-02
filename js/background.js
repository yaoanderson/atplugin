var elementMap = {};
var stepMap = {};
var currentUrl = "";

function addSleepStepRow() {
    if (stepMap.hasOwnProperty(currentUrl) === true) {
        stepMap[currentUrl].push(["PAGE", "", "sleep"]);
    }
    else {
        stepMap[currentUrl] = [["PAGE", "", "sleep"]];
    }
}

function removeElementRow(index) {
    elementMap[currentUrl].splice(index, 1);
}

function removeStepRow(index) {
    stepMap[currentUrl].splice(index, 1);
}

function updateStepOperationRow(index, val1, val2) {
    stepMap[currentUrl][index][1] = val1;
    stepMap[currentUrl][index][2] = val2;
}

function updateStepValueRow(index, val) {
    stepMap[currentUrl][index][1] = val;
}

function updateStepNameRow(index, val) {
    var stepList = stepMap[currentUrl];
    var name = elementMap[currentUrl][index][0];
    for (var i=0; i<stepList.length; i++) {
        if (name === stepList[i][0]) {
            stepList[i][0] = val;
        }
    }

}

function updateElementNameRow(index, val) {
    elementMap[currentUrl][index][0] = val;
}

function cleanAllStepRows() {
    stepMap[currentUrl] = [];
}

function updateUrl(url) {
    currentUrl = url;
}

function getUrl() {
    return currentUrl;
}

function getElementsOutput() {
    var elementsString = "ID,NAME,TYPE,VALUE\n";
    var elementList = elementMap[currentUrl];
    for (var i=0; i<elementList.length; i++) {
        elementsString += (i+1) + "," + elementList[i][0] + "," + elementList[i][1] + "," + elementList[i][2] + "\n";
    }
    return elementsString;
}

function getStepsOutput() {
    var stepsString = "ID,ELEMENT,VALUE,OPERATION\n";
    var stepList = stepMap[currentUrl];
    for (var i=0; i<stepList.length; i++) {
        stepsString += (i+1) + "," + stepList[i][0] + "," + stepList[i][1] + "," + stepList[i][2] + "\n";
    }
    return stepsString;
}

function getStepsListForTemplate() {
    var elementList = elementMap[currentUrl];
    var elementDict = {};
    for (var i=0; i<elementList.length; i++) {
        elementDict[elementList[i][0]] = elementList[i].slice(1,);
    }

    var stepList =  stepMap[currentUrl];
    var returnStepList = [];
    for (var j=0; j<stepList.length; j++) {
        if (stepList[j][2] === "sleep") {
            returnStepList.push(stepList[j]);
        }
        else {
            if (elementDict.hasOwnProperty(stepList[j][0])) {
                var element = elementDict[stepList[j][0]];
                returnStepList.push(stepList[j].concat(element[element.length-1]));
            }
            else {
                returnStepList.push(stepList[j]);
            }
        }
    }
    return returnStepList;
}

chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
    if (req.status === 1) {
        updateUrl(req.url);

        var name = req.name;
        if (name === undefined) {
            sendResponse("add new step failed");
            return;
        }

        if (elementMap.hasOwnProperty(currentUrl) === true) {
            var elements = elementMap[currentUrl];
            var exist = false;
            for (var i=0; i<elements.length; i++) {
                if (elements[i][1] === req.type && elements[i][2] === req.wid) {
                    exist = true;
                    name = elements[i][0];
                    break;
                }
            }
            if (exist === false) {
                elementMap[currentUrl].push([name, req.type, req.wid, req.category]);
            }
        }
        else {
            elementMap[currentUrl] = [[name, req.type, req.wid, req.category]];
        }

        var operation = req.category;
        if (stepMap.hasOwnProperty(currentUrl) === true) {
            stepMap[currentUrl].push([name, (operation === "input" || req.value !== "") ? req.value: "", operation]);
        }
        else {
            stepMap[currentUrl] = [[name, (operation === "input" || req.value !== "") ? req.value: "", operation]];
        }

        sendResponse("add new step");
    }
    else if (req.status === 2) {
        var elementList = [];
        if (elementMap.hasOwnProperty(currentUrl) === true) {
            elementList = elementMap[currentUrl];
        }

        sendResponse(JSON.stringify({"elements": elementList}));
    }
    else if (req.status === 3) {
        var stepList = [];
        if (stepMap.hasOwnProperty(currentUrl) === true) {
            stepList = stepMap[currentUrl];
        }

        sendResponse(JSON.stringify({"steps": stepList}));
    }
    else {
        sendResponse("wrong status.")
    }

});