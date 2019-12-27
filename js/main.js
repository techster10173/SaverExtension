chrome.windows.getAll({populate:true}, getAllOpenWindows);
displayData();

var tabs = [];

document.addEventListener('DOMContentLoaded', function () {
    var saver = document.getElementById("saveBtn");
    saver.addEventListener('click', function () {
       saveState();
    });
});

function saveState() {
    var stateName = document.getElementById("stateName").value;
    saveData(tabs, stateName);
}

function displayData() {
    var keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        var card = document.createElement("div");
        var cardHeader = document.createElement("div");
        card.className = "card";
        cardHeader.className = "card-header";
        var header = document.createElement("h2");
        header.className = "mb-0";
        var link = document.createElement("div");
        link.className = "d-inline-block";
        link.appendChild(document.createTextNode(keys[i]));
        link.setAttribute("keyName", keys[i]);

        link.onclick = function () {
          openTabs(this.getAttribute("keyName"));
        };

        var key = document.createElement("button");
        key.className = "btn float-right";
        key.setAttribute("data-toggle", "collapse");
        key.setAttribute("data-target", "#" + keys[i]);

        var ddicon = document.createElement("i");
        ddicon.className = "fas fa-chevron-down";
        key.appendChild(ddicon);
        var trash = document.createElement("button");
        trash.className = "btn float-right bg-danger text-white";
        trash.setAttribute("keyName", keys[i]);
        var close = document.createElement("i");
        close.className = "fas fa-trash";
        trash.appendChild(close);

        trash.onclick = function(){
            deleteState(this.getAttribute("keyName"));
        };

        header.appendChild(link);

        var details = document.createElement("div");
        details.className = "collapse";
        details.setAttribute("data-parent", "#stateList");
        details.setAttribute("id", keys[i]);
        var detailsContainer = document.createElement("div");
        detailsContainer.className = "card-body";
        details.appendChild(detailsContainer);

        var list = document.createElement("ul");
        list.className = "list-group list-group-flush";

        var tempObject = JSON.parse(localStorage.getItem(keys[i]));
        // console.log(tempObject);
        for(var k  = 0; k < tempObject.length; k++){
            var element = document.createElement("a");
            element.className = "list-group-item";
            element.setAttribute("href", tempObject[k].url);
            element.setAttribute("target", "_blank");
            element.appendChild(document.createTextNode(tempObject[k].title));
            list.appendChild(element);
        }

        detailsContainer.appendChild(list);
        header.appendChild(key);
        header.appendChild(trash);
        cardHeader.appendChild(header);
        card.appendChild(cardHeader);
        card.appendChild(details);

        document.getElementById("stateList").appendChild(card);
    }
}

function getAllOpenWindows(winData) {
    for (var i in winData) {
        if (winData[i].focused === true) {
            var winTabs = winData[i].tabs;
            var totTabs = winTabs.length;
            for (var j=0; j<totTabs;j++) {
                const tabData = {
                    'title': winTabs[j].title,
                    'url': winTabs[j].url
                };
                tabs.push(tabData);
            }
        }
    }
    // console.log(tabs);
}

function saveData(currentTabs, stateName){
    currentTabs = JSON.stringify(currentTabs);
    window.localStorage.setItem(stateName, currentTabs);
}

function openTabs(key) {
    var tempObject = JSON.parse(localStorage.getItem(key));
    var tempArray = [];
    for(var k  = 0; k < tempObject.length; k++) {
        tempArray.push(tempObject[k].url);
    }
    console.log(tempArray);
    chrome.windows.create({url: tempArray});
}

function deleteState(id){
    window.localStorage.removeItem(id);
}