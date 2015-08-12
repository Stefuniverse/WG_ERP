function getNews(first, last) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", "newsfeed", false);
    xmlhttp.send();
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        document.getElementById("content-div").innerHTML = xmlhttp.responseText;
    }
}