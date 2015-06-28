var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');


var basedir = './www';
var supported = {
    ".html": "text/html",
    ".css": "text/css"
}


function handleRequest(req, res) {
    var routing = basedir;
    var endCon = function (res) {
        res.end();
    }

    var url = req.url;
    if (url === '/') {
        sendFile('www/main.html', "text/html", res, endCon);
    } else {
        url = basedir + url;
        console.log(url);
        if (fs.existsSync(url)) {
            if (supported[path.extname(url)]) {
                sendFile(url, supported[path.extname(url)], res, endCon);
            } else {
                res.writeHeader(403, { "Content-Type": "text/html" });
            }
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end();
        }
    }
    console.log(req.method);
}

function sendFile(file, type, res, callback) {
    fs.readFile(file, function (err, html) {
        if (err) {
            throw err;
        } else {
            res.writeHeader(200, { "Content-Type": type });
            res.write(html);
            callback(res);
        }
    });
}

var server = http.createServer(handleRequest);
server.listen(1337);
console.log('Server startet');