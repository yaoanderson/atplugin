var control_key = false;

var w = new wep();

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function getDomType(dom) {
    if (dom.tagName === "INPUT") {
        const tp = $(dom).attr("type");
        if (tp === "button" || tp === "submit" || tp === "file" || tp === "reset") {
            return "button";
        }
        else if (tp === "radio" || tp === "checkbox") {
            return "select field";
        }
        else {
            return "input field";
        }
    }
    else if (dom.tagName === "A") {
        return "link";
    }
    else if (dom.tagName === "BUTTON") {
        return "button";
    }
    else if (dom.tagName === "IMG") {
        return "image";
    }
    else {
        return "element";
    }

}

document.addEventListener('mousedown', function (event) {
    if (control_key === false) {
        return;
    }
    const result = w.getUniqueId(event.target);
    var tagName = event.target.tagName;
    if (tagName === "svg") {
        tagName = event.target.parentNode.tagName;
    }

    var value = "";
    if (result.type === "css" && result.wid.indexOf("tr") !== -1 && result.wid.indexOf("td") !== -1) {
        var row = result.wid.slice(result.wid.indexOf("tr")+2, result.wid.indexOf(">td"));
        var preStr = "\"" + row + "\"";
        if (row.indexOf("nth-child(") !== -1) {
            preStr = row.slice(row.indexOf("nth-child(")+10, row.indexOf(")")) + "th";
        }
        value = "Row " + preStr + ", Col " + result.wid.slice(result.wid.indexOf("nth-child(")+10, result.wid.indexOf("nth-child(")+11) + "th";
    }
    chrome.runtime.sendMessage({
        status: 1,
        url: window.location.hostname,
        name: tagName + "-" + randomString(10),
        wid: result.wid,
        type: result.type,
        value: value,
        category: getDomType(event.target)
    }, res => {
        // 答复
        // alert(res)
    })
});

document.addEventListener('keydown', function (e) {
    switch(e.keyCode) {
        case 16: // shift key
            control_key = true;
            return;

    }
});

document.addEventListener('keyup', function (e) {
    if (16 === e.keyCode){  // shift key
        control_key = false;
    }
});


$("input").on('change', function(){
    var value = $(this).val();
    const result = w.getUniqueId(this);
    chrome.runtime.sendMessage({
        status: 1,
        url: window.location.hostname,
        name: this.tagName + "-" + randomString(10),
        wid: result.wid,
        type: result.type,
        value: value,
        category: "input"
    }, res => {
        // 答复
        // alert(res)
    })
});