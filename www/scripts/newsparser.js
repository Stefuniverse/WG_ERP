function getNews(first, last) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var toParse = JSON.parse(xmlhttp.responseText);
            var parsedData = "";
            toParse.forEach(function (x, y) {
                console.log(x.type);
                if (x.type === 1) {
                    console.log(x.text);
                    parsedData += ("<div class=\"chatp\"><h3>" + x.name + "</h3><hr  class=\"sepl\"/><p>" + x.text + "</p></div>");
                }
            });
            document.getElementById("content-div").innerHTML = parsedData
        }
    }
    xmlhttp.open("POST", "newsfeed", true);
    xmlhttp.send();
}