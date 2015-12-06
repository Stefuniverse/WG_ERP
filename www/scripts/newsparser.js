function getNews(first, last) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
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
    }
    xmlhttp.open("POST", "newsfeed", true);
    xmlhttp.send();
}