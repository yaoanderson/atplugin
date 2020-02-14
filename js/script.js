
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
        if (dom.tagName === "TD" || dom.parentNode.tagName === "TD") {
            return "table cell";
        }
        return "element";
    }

}

window.onload = function() {
    var control_key = false;

    var w = new wep();

    document.addEventListener('mousedown', function (event) {
        if (control_key === false) {
            return;
        }
        var result = w.getUniqueId(event.target);
        var tagName = event.target.tagName;
        var category = event.target;
        if (tagName === "svg") {
            tagName = event.target.parentNode.tagName;
            category = event.target.parentNode;
        }

        var value = "";
        var td = event.target.tagName === "TD"? $(event.target): null;
        if (td === null) {
            td = $(event.target).parents("td").length !== 0? $(event.target).parents("td").eq(0): null;
        }
        if (td !== null) {
            var dom = prompt("Please choose element: [0 is 'table', 1 is 'current' (default)], if need to get table data, please choose 0.", 1);
            if (dom === "0") {
                var rowNum = parseInt(td.parent().parent().find("tr").index(td.parent()[0]))+1;
                var colNum = parseInt(td.index());

                var preStr = rowNum + "th";
                var postStr = (colNum+1) + "th";
                if ($(event.target).parents("table").eq(0).has("thead").length !== 0) {
                    postStr = "(" + $(event.target).parents("table").find("thead>tr>th:eq(" + colNum + ")").text() + ")";
                }
                value = "Row " + preStr + "| Col " + postStr + "| Value (" + $(event.target).text() + ")";

                const table = td.parents("table").eq(0)[0];
                result = w.getUniqueId(table);
                tagName = table.tagName;

            }

            control_key = false;
        }

        chrome.runtime.sendMessage({
            status: 1,
            url: window.location.href.split("?")[0],
            name: tagName + "-" + randomString(10),
            wid: result.wid,
            type: result.type,
            value: value,
            event: "click",
            category: getDomType(category)
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

    document.querySelectorAll("input").forEach(element => {
        element.addEventListener('input', function () {
            var value = $(this).val();
            const result = w.getUniqueId(this);
            chrome.runtime.sendMessage({
                status: 1,
                url: window.location.href.split("?")[0],
                name: this.tagName + "-" + randomString(10),
                wid: result.wid,
                type: result.type,
                value: value,
                event: "input",
                category: "input field"
            }, res => {
                // 答复
                // alert(res)
            })
        });
    })
};
