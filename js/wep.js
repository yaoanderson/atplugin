function initFunction(){
    return function (argument) {};
}

var document = window.document,
wep = initFunction(),
prototype = wep.prototype;
prototype.getUniqueId = function (element) {
    if (element instanceof SVGElement) {
        element = element.parentNode;
    }
    else if(!(element instanceof HTMLElement)){
        console.error("input is not a HTML element");
        return {};
    }
    var result = {
        wid:"",
        type:"",
        text: element.innerText
    },
    //construct data info of the element
    id = element.id,
    name = element.name,
    tag = element.tagName.toLowerCase(),
    type = element.type?element.type.toLowerCase():"",
    className = "",
    classList = element.classList || [];
    classList.forEach(function (item) {
        className += "."+item;
    });
    if(tag==="body" || tag=== "html"){
        result.wid = tag;
        result.type= tag;
    }
    //location by id
    if(id && document.getElementById(id) === element){
        result.wid = id;
        result.type = "id"
    }
    //location by name
    if(!result.wid && name && document.getElementsByName(name)[0] === element){
        result.wid = name;
        result.type = "name"
    }
    //location by class
    if(!result.wid && className && document.querySelector(tag+className)===element){
        result.wid = tag+className;
        result.type = "css";
    }
    //for radio
    if(type === "radio"){
        var value = element.value,queryString = tag+"[value='"+value+"']";
        if(name){
            queryString += "[name='"+name+"']"
        }
        if(document.querySelector(queryString)===element){
            result.wid = queryString;
            result.type = "css"
        }
    }
    //location by mixed,order
    if(!result.wid){
        queryString = tag;
        queryString = className ? queryString +className: queryString;
        queryString = name? queryString + "[name='"+name+"']": queryString;
        if(prototype.getTarget(queryString)===element){
            result.wid = queryString;
            result.type = "css"
        }
    }
    //location by order
    if(!result.wid){
        queryString = tag;
        queryString = className ? queryString +className: queryString;

        var elements = document.querySelectorAll(queryString);
        if(elements && elements.length>0){
            var index = null;
            for(var i=0; i<elements.length; i++){
                if(element===elements[i]){
                    index = i+1;
                    break;
                }
            }
            if(index){
                if(document.querySelectorAll(queryString)[index-1] === element){
                    result.wid = queryString;
                    result.type = "css"
                }
            }
        }
    }

    return result
};
prototype.getTarget = function (queryString) {
    return document.getElementById(queryString) || document.getElementsByName(queryString)[0] || document.querySelector(queryString);
};

window.wep = wep;