function clickTemplate(element, ct, val) {
    var cell = "";
    if (ct === "table cell" && val !== "") {
        cell = " [" + val + "]";
    }
    return "Click " + ct + " (" + element + ")" + cell;
}

function hoverTemplate(element, ct) {
    return "Hover on " + ct + " (" + element + ")";
}

function waitTemplate(element, ct) {
    return "Wait for " + ct + " (" + element + ")";
}

function inputTemplate(element, ct, val) {
    return "Input '" + val + "' in " + ct + " (" + element + ")";
}

function checkTemplate(element, ct, val) {
    return "Check the value of " + ct + " (" + element + ")" + " is '" + val + "'";
}

function sleepTemplate(val) {
    return "Wait for " + val + "s";
}

function keywordTemplate(val) {
    return "Invoke keyword file (" + val.split("|")[0] + ") with arguments (" + val.split("|")[1] + ")";
}

function functionTemplate(val) {
    return "Invoke function (" + val.split("|")[0] + ") with arguments (" + val.split("|")[1] + ")";
}

function generateStepCase(stepLine) {
    if (stepLine[2] === "sleep") {
        return sleepTemplate(stepLine[1]);
    }
    else if (stepLine[2] === "keyword") {
        return keywordTemplate(stepLine[1]);
    }
    else if (stepLine[2] === "function") {
        return functionTemplate(stepLine[1]);
    }

    var ct = "element";
    if (stepLine.length === 4) {
        ct = stepLine[3];
    }
    if (stepLine[2] === "click") {
        return clickTemplate(stepLine[0], ct, stepLine[1]);
    }
    else if (stepLine[2] === "hover") {
        return hoverTemplate(stepLine[0], ct);
    }
    else if (stepLine[2] === "wait") {
        return waitTemplate(stepLine[0], ct);
    }
    else if (stepLine[2] === "input") {
        return inputTemplate(stepLine[0], ct, stepLine[1]);
    }
    else if (stepLine[2] === "check") {
        return checkTemplate(stepLine[0], ct, stepLine[1]);
    }
    else {
        return "";
    }
}

function generateAllStepCase(url, steplines) {
    var stepsText = "Go to Page (" + url + ")\n";
    for (var i=0; i<steplines.length; i++) {
        stepsText += (i+1) + ". " + generateStepCase(steplines[i]) + "\n";
    }
    return stepsText;
}