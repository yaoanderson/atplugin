function clickTemplate(element, ct) {
    return "Click " + ct + " (" + element + ")";
}

function hoverTemplate(element, ct) {
    return "Hover on " + ct + " (" + element + ")";
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

function generateStepCase(stepLine) {
    if (stepLine[2] === "click") {
        return clickTemplate(stepLine[0], stepLine[3]);
    }
    else if (stepLine[2] === "hover") {
        return hoverTemplate(stepLine[0], stepLine[3]);
    }
    else if (stepLine[2] === "input") {
        return inputTemplate(stepLine[0], stepLine[3], stepLine[1]);
    }
    else if (stepLine[2] === "check") {
        return checkTemplate(stepLine[0], stepLine[3], stepLine[1]);
    }
    else if (stepLine[2] === "sleep") {
        return sleepTemplate(stepLine[1]);
    }
}

function generateAllStepCase(url, steplines) {
    var stepsText = "Go to Page " + url + "\n";
    for (var i=0; i<steplines.length; i++) {
        stepsText += (i+1) + ". " + generateStepCase(steplines[i]) + "\n";
    }
    return stepsText;
}