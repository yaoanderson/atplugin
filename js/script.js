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

document.addEventListener('mousedown', function (event) {
    if (control_key === false) {
        return;
    }
    const result = w.getUniqueId(event.target);
    var tagName = event.target.tagName;
    if (tagName === "svg") {
        tagName = event.target.parentNode.tagName;
    }
    chrome.runtime.sendMessage({
        status: 1,
        url: window.location.href,
        name: tagName + "-" + randomString(10),
        wid: result.wid,
        type: result.type,
    }, res => {
        // 答复
        // alert(res)
    })
});

document.addEventListener('keydown', function (e) {
    switch(e.keyCode) {
        case 91: // alt or command key
            control_key = true;
            return;

    }
});

document.addEventListener('keyup', function (e) {
    if (91 === e.keyCode){  // alt or command key
        control_key = false;
    }
});


$("input").on('change', function(){
    var value = $(this).val();

    const result = w.getUniqueId(this);
    chrome.runtime.sendMessage({
        status: 1,
        url: window.location.href,
        wid: result.wid,
        type: result.type,
        value: value
    }, res => {
        // 答复
        // alert(res)
    })
});