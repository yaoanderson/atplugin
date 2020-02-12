function getElements() {
    chrome.runtime.sendMessage({
        status: 2,
    }, res => {
        // 答复
        var stepsElements = JSON.parse(res);
        var elementList = stepsElements["elements"];
        var bg = chrome.extension.getBackgroundPage();
        $('#elements > tbody').html("");
        if (elementList.length === 0) {
            $("#elementEmptyTableInfo").attr("style", "display:block");
        }
        else {
            $("#elementEmptyTableInfo").attr("style", "display:none");
        }
        for (var i=0; i<elementList.length; i++) {
            $('#elements > tbody').append("<tr><td>" + (i+1) + "</td><td><input type='text' id='een" + i + "' value='" + elementList[i][0] + "'></td><td>" + elementList[i][1] + "</td><td>" + elementList[i][2] + "</td><td><button type=\"button\" id='b" + i + "'>X</button></td></tr>");

            const n = i;
            $('#b' + n).click(function (e) {
                removeElement(parseInt(e.target.id.slice(1,)));
            });

            $('#een' + n).bind('input propertychange', function() {
                bg.updateStepNameRow(parseInt($(this).parent().parent().find("td:eq(0)").text())-1, $(this).val().replace(", ", ",").replace(/'/g, "\""));
                bg.updateElementNameRow(parseInt($(this).parent().parent().find("td:eq(0)").text())-1, $(this).val().replace(", ", ",").replace(/'/g, "\""));
            });
        }
    });
}

function getSteps() {
    chrome.runtime.sendMessage({
        status: 3,
    }, res => {
        // 答复
        var stepsElements = JSON.parse(res);
        var stepList = stepsElements["steps"];

        $('#steps > tbody').html("");
        if (stepList.length === 0) {
            $("#stepEmptyTableInfo").attr("style", "display:block");
        }
        else {
            $("#stepEmptyTableInfo").attr("style", "display:none");
        }
        var operation = "";
        for (var i=0; i<stepList.length; i++) {
            if (stepList[i][2] === "sleep") {
                operation = "sleep";
            }
            else if (stepList[i][2] === "keyword") {
                operation = "keyword";
            }
            else if (stepList[i][2] === "function") {
                operation = "function";
            }
            else {
                operation = "<select id='ss" + i + "'>\n<option value ='click'>click</option>\n<option value ='hover'>hover</option>\n<option value ='wait'>wait</option>\n<option value ='input'>input</option>\n<option value ='check'>check</option>\n</select>".replace(">" + stepList[i][2] + "<", "selected = 'selected'>" + stepList[i][2] + "<");
            }
            $('#steps > tbody').append("<tr><td>" + (i+1) + "</td><td><input type='text' style='background-color: #f3f3f3' disabled id='sen" + i + "' value='" + stepList[i][0] + "'></td><td>" + "<input type='text' " + ((stepList[i][2] === "keyword" || stepList[i][2] === "function" || stepList[i][2] === "check" || stepList[i][2] === "sleep" || stepList[i][2] === "input")? "": "disabled") + " value='" + stepList[i][1] + "'>" + "</td><td>" + operation + "</td><td><button type=\"button\" id='s" + i + "'>X</button></td></tr>");

            $('#s' + i).click(function (e) {
                removeStep(parseInt(e.target.id.slice(1,)));
            });

            if (stepList[i][2] !== "sleep" && stepList[i][2] !== "check" && stepList[i][2] !== "input" && stepList[i][2] !== "keyword" && stepList[i][2] !== "function") {
                $('#steps > tbody').find("tr:last>td:eq(2)").find("input").attr("style", "background-color: #f3f3f3");
            }

            var bg = chrome.extension.getBackgroundPage();

            if (operation !== "sleep" && operation !== "keyword" && operation !== "function") {
                var ss = $('#ss' + i);
                ss.change(function () {
                    if ($(this).children('option:selected').val() === "check" || $(this).children('option:selected').val() === "input") {
                        $(this).parent().prev().find("input").removeAttr("disabled");
                        $(this).parent().prev().find("input").removeAttr("style");
                    }
                    else {
                        $(this).parent().prev().find("input").val("");
                        $(this).parent().prev().find("input").attr("disabled","disabled");
                        $(this).parent().prev().find("input").attr("style", "background-color: #f3f3f3");
                    }

                    bg.updateStepOperationRow(parseInt($(this).parent().parent().find("td:eq(0)").text())-1, $(this).parent().prev().find("input").val(), $(this).children('option:selected').val());
                });

                ss.parent().prev().find("input").bind('input propertychange', function() {
                    bg.updateStepValueRow(parseInt($(this).parent().parent().find("td:eq(0)").text())-1, $(this).val() === ""? "": parseInt($(this).val()));bg.updateStepValueRow(parseInt($(this).parent().parent().find("td:eq(0)").text())-1, $(this).val().replace(", ", ",").replace(/'/g, "\""));
                });
            }
            else {
                $('#steps > tbody').find("tr:last").find("td:eq(2)").find("input").bind('input propertychange', function() {
                    bg.updateStepValueRow(parseInt($(this).parent().parent().find("td:eq(0)").text())-1, $(this).val() === ""? "": parseInt($(this).val()));
                });
            }

        }
    });
}

function removeElement(index) {
    var bg = chrome.extension.getBackgroundPage();
    bg.removeElementRow(index);

    getElements();

}

function removeStep(index) {
    var bg = chrome.extension.getBackgroundPage();
    bg.removeStepRow(index);

    getSteps();

}


// generate file
function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
    );
    obj.dispatchEvent(ev);
}

function export_raw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;

    var export_blob = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fake_click(save_link);
}
// end generate file

// upload file
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    if(files[0])
    {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = loaded;
    }
}

function loaded(evt) {
    var fileString = evt.target.result;
    if (fileString === "") {
        return;
    }

    var url = fileString.split("\n")[0];
    // url = url.split("//")[1].split("/")[0];
    url = url.split("?")[0];

    const lines = fileString.split("\n").slice(2,);
    var ls = [];
    for (var i=0; i<lines.length; i++) {
        if (lines[i] !== "") {
            const li = lines[i].split(", ").slice(1,);
            li[1] = li[1].replace(/'/g, "\"");
            ls.push(li);
        }
    }

    var bg = chrome.extension.getBackgroundPage();

    var tab = $(".tab-head>.selected").text();
    if (tab === "Elements") {
        bg.uploadElements(url, ls);
        getElements();
    }
    else {
        bg.uploadSteps(url, ls);
        getSteps();
    }

}
// end upload file

window.onload = function() {
    chrome.tabs.query({currentWindow: true, active:true}, function (tab) {
        // var url = (new URL(tab[0].url)).hostname;
        var url = tab[0].url.split("?")[0];

        var bg = chrome.extension.getBackgroundPage();
        bg.updateUrl(url);
        $("#url").val(tab[0].url);

        getSteps();

        $('#ufb').click(function () {
            $("#uf").click();
        });

        var btn = document.getElementById('uf');
        btn.addEventListener('change', handleFileSelect, false);

        $('#gf').click(function () {
            var bg = chrome.extension.getBackgroundPage();
            var url = $("#url").val();
            var tab = $(".tab-head>.selected").text();
            var fileName = "steps";
            if (tab === "Elements") {
                fileName = "elements";
                export_raw(fileName + '.csv', bg.getElementsOutput(url));
            }
            else {
                export_raw(fileName + '.csv', bg.getStepsOutput(url));
            }

        });

        $('#gtc').click(function () {
            var bg = chrome.extension.getBackgroundPage();
            export_raw('testcase.txt', generateAllStepCase($("#url").val(), bg.getStepsListForTemplate()));

        });

        $("#addSleep").click(function () {
            var id = $('#steps > tbody').find("tr:last").find("td:first").text();
            if (id === "") {
                $("#stepEmptyTableInfo").attr("style", "display:none");
            }
            var i = id !== ""? parseInt(id): 0;
            $('#steps > tbody').append("<tr><td>" + (i+1) + "</td><td><input type='text' style='background-color: #f3f3f3' disabled id='sen" + i + "' value='PAGE'></td><td>" + "<input type='text' value='1'>" + "</td><td>sleep</td><td><button type=\"button\" id='s" + i + "'>X</button></td></tr>");
            var bg = chrome.extension.getBackgroundPage();
            bg.addSleepStepRow();

            $('#s' + i).click(function (e) {
                removeStep(parseInt(e.target.id.slice(1,)));
            });

            $('#steps > tbody').find("tr:last").find("td:eq(2)").find("input").bind('input propertychange', function() {
                var id = $(this).parent().parent().find("td:eq(0)").text();
                if (!($(this).val() === "" || isNaN($(this).val()))) {
                    bg.updateStepValueRow(id === ""? 0: parseInt(id)-1, parseInt($(this).val()));
                }

            });
        });

        $("#addFunction").click(function () {
            var id = $('#steps > tbody').find("tr:last").find("td:first").text();
            if (id === "") {
                $("#stepEmptyTableInfo").attr("style", "display:none");
            }
            var i = id !== ""? parseInt(id): 0;
            $('#steps > tbody').append("<tr><td>" + (i+1) + "</td><td><input style='background-color: #f3f3f3' disabled type='text' id='sen" + i + "' value='PAGE'></td><td>" + "<input type='text' value='<function name>|<function arguments>'>" + "</td><td>function</td><td><button type=\"button\" id='s" + i + "'>X</button></td></tr>");
            var bg = chrome.extension.getBackgroundPage();
            bg.addFunctionStepRow("<function name>|<function arguments>");

            $('#s' + i).click(function (e) {
                removeStep(parseInt(e.target.id.slice(1,)));
            });

            $('#steps > tbody').find("tr:last").find("td:eq(2)").find("input").bind('input propertychange', function() {
                var id = $(this).parent().parent().find("td:eq(0)").text();
                bg.updateStepValueRow(id === ""? 0: parseInt(id)-1, $(this).val());
            });
        });

        $("#addKeyword").click(function () {
            var keyword = prompt("Please input keyword file name: ");
            if (keyword === null || keyword === "") {
                confirm("keyword name is not empty.");
                return;
            }

            var id = $('#steps > tbody').find("tr:last").find("td:first").text();
            if (id === "") {
                $("#stepEmptyTableInfo").attr("style", "display:none");
            }
            var i = id !== ""? parseInt(id): 0;
            $('#steps > tbody').append("<tr><td>" + (i+1) + "</td><td><input style='background-color: #f3f3f3' disabled type='text' id='sen" + i + "' value='PAGE'></td><td>" + "<input type='text' value='" + keyword + "|<keyword arguments>'>" + "</td><td>keyword</td><td><button type=\"button\" id='s" + i + "'>X</button></td></tr>");
            var bg = chrome.extension.getBackgroundPage();
            bg.addKeywordStepRow(keyword+ "|<keyword arguments>");

            $('#s' + i).click(function (e) {
                removeStep(parseInt(e.target.id.slice(1,)));
            });

            $('#steps > tbody').find("tr:last").find("td:eq(2)").find("input").bind('input propertychange', function() {
                var id = $(this).parent().parent().find("td:eq(0)").text();
                bg.updateStepValueRow(id === ""? 0: parseInt(id)-1, $(this).val());
            });
        });

        $("#cleanAllSteps").click(function () {
            var bg = chrome.extension.getBackgroundPage();
            bg.cleanAllStepRows();
            $('#steps > tbody').html("");
            $("#stepEmptyTableInfo").attr("style", "display:block");
        });

        $("#use").click(function () {
            alert("Use:\n* User can click web page elements when pressing keyboard 'shift' key, then will see clicked elements list and operation steps list in the plugin popup\n* User can click 'generate data' button to output data files for automation and click 'generate testcase' button to output manual testcase file.\n* User can add sleep step to wait for the visualization of elements.\n* User can add function step to call custom function.\n* User can add keyword step to include amount of steps.\n* User can upload data file in order to continue to edit and improve case and elements.");
        })

    });

};


$(function(){
    var tabs = document.getElementsByClassName('tab-head')[0].getElementsByTagName('h2'),
        contents = $(".tab-content>div");

    (function changeTab(tab) {
        for(var i = 0, len = tabs.length; i < len; i++) {
            tabs[i].onclick = showTab;
        }
    })();

    function showTab() {
        for(var i = 0, len = tabs.length; i < len; i++) {
            if(tabs[i] === this) {
                tabs[i].className = 'selected';
                tabs[i].style.color = '#000';
                contents.eq(i).attr("class", "show");

                if ($(this).text() === "Elements") {
                    getElements();
                    $("#gtc").attr("style", "display:none");
                }
                else if ($(this).text() === "Steps") {
                    getSteps();
                    $("#gtc").attr("style", "display:inline-block");
                }
            } else {
                tabs[i].className = '';
                tabs[i].style.color = '#ccc';
                contents.eq(i).attr("class", "");
            }
        }
    }
});
