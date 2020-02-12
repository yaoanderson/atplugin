var elementMap = {};
var stepMap = {};
var currentUrl = "";

function addSleepStepRow() {
    if (stepMap.hasOwnProperty(currentUrl) === true) {
        stepMap[currentUrl].push(["PAGE", 1, "sleep"]);
    }
    else {
        stepMap[currentUrl] = [["PAGE", 1, "sleep"]];
    }
}

function addKeywordStepRow(keyword) {
    if (stepMap.hasOwnProperty(currentUrl) === true) {
        stepMap[currentUrl].push(["PAGE", keyword, "keyword"]);
    }
    else {
        stepMap[currentUrl] = [["PAGE", keyword, "keyword"]];
    }
}

function addFunctionStepRow(val) {
    if (stepMap.hasOwnProperty(currentUrl) === true) {
        stepMap[currentUrl].push(["PAGE", val, "function"]);
    }
    else {
        stepMap[currentUrl] = [["PAGE", val, "function"]];
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

function getElementsOutput(url) {
    var elementsString = url + "\n";
    elementsString += "ID, NAME, TYPE, VALUE, CATEGORY\n";
    var elementList = elementMap[currentUrl];
    if (elementList !== undefined) {
        for (var i=0; i<elementList.length; i++) {
            elementsString += (i+1) + ", " + elementList[i][0] + ", " + elementList[i][1] + ", " + elementList[i][2] + ", " + elementList[i][3] + "\n";
        }
    }

    return elementsString;
}

function getStepsOutput(url) {
    var stepsString = url + "\n";
    stepsString += "ID, ELEMENT, VALUE, OPERATION\n";
    var stepList = stepMap[currentUrl];
    if (stepList !== undefined) {
        for (var i=0; i<stepList.length; i++) {
            stepsString += (i+1) + ", " + stepList[i][0] + ", " + stepList[i][1] + ", " + stepList[i][2] + "\n";
        }
    }

    return stepsString;
}

function getStepsListForTemplate() {
    var elementDict = {};
    var elementList = elementMap[currentUrl];
    if (elementList !== undefined) {
        for (var i=0; i<elementList.length; i++) {
            elementDict[elementList[i][0]] = elementList[i].slice(1,);
        }
    }

    var returnStepList = [];
    var stepList =  stepMap[currentUrl];
    if (stepList !== undefined) {
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
    }

    return returnStepList;
}

function uploadSteps(url, val) {
    stepMap[url] = val;
}

function uploadElements(url, val) {
    elementMap[url] = val;
}

chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
    var stepList = [];

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

        var operation = req.event;
        if (stepMap.hasOwnProperty(currentUrl) === true) {
            stepList = stepMap[currentUrl];
            var value = (operation === "input" || req.value !== "") ? req.value.replace(", ", ",").replace(/'/g, "\""): "";
            var lastest = stepList[stepList.length - 1];
            if (operation === "input" && lastest[2] === "input" && name === lastest[0]) {
                stepMap[currentUrl][stepList.length - 1][1] = value;
            }
            else {
                stepMap[currentUrl].push([name, value, operation]);
            }

        }
        else {
            stepMap[currentUrl] = [[name, (operation === "input" || req.value !== "") ? req.value.replace(", ", ",").replace(/'/g, "\""): "", operation]];
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
        if (stepMap.hasOwnProperty(currentUrl) === true) {
            stepList = stepMap[currentUrl];
        }

        sendResponse(JSON.stringify({"steps": stepList}));
    }
    else {
        sendResponse("wrong status.")
    }

});
