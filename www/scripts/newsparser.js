var lastNews;
var newsLoaded;
function getNews(first, last, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var toParse = JSON.parse(xmlhttp.responseText);
            callback(toParse);   
        } 
    }
    xmlhttp.open("POST", "newsfeed", true);
    xmlhttp.send("upperLimit="+last+"lowerLimit="+first);
}

//function update() {
//    setInterval(getNews(0, 10, updateNews), 1000);
//}

function chainBehind(toParse){
    console.log(toParse);
    var parsedData = "";
    toParse.forEach(function (x, y) {
        console.log(x.type);
        if (x.type === 1) {
            console.log(x.text);
            parsedData += ("<div class=\"chatp\" id=\""+x.rowid+"\"><h3>" + x.name + "</h3><hr  class=\"sepl\"/><p>" + x.text + "</p></div>");
        } //TODO Implement other types
    });
    document.getElementById("content-div").innerHTML = parsedData
}

function updateNews(data) {
    var toParse = JSON.parse(xmlhttp.responseText);
    console.log(toParse);
    var parsedData = "";
    toParse.forEach(function (x, y) {
        console.log(x.type);
        if (x.type === 1) {
            console.log(x.text);
            parsedData += ("<div class=\"chatp\"><h3>" + x.name + "</h3><hr  class=\"sepl\"/><p>" + x.text + "</p></div>");
        } //TODO Implement other types
    });
    document.getElementById("content-div").innerHTML = parsedData
}