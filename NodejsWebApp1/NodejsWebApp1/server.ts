var http = require('http');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3')
var utils = require('util');
var querystring = require('querystring');
var sessions = require('sesh/lib/core').magicSession();


var basedir = './www';
var supported = {
    ".html": "text/html",
    ".css": "text/css"
}

function endCon (res) {
    res.end();
}

function handleRequest(req, res) {
    var routing = basedir;
    var url = req.url;
    if (url === '/') {
        sendFile('www/login.html', "text/html", res, endCon);
    } else if (url === '/logon') {

        if (req.method === 'POST') {
            console.log('Login request gained from' + req.host);
            var fullBody = '';

            req.on('data', function (chunk) {

                fullBody += chunk.toString();
            });

            req.on('end', function () {

                var data = querystring.parse(fullBody);
                if (data.uname && data.password) {
                    checkPasswd(data.uname, data.password, req, res);
                }

            });
        }

    } else {
        testSessionValid(res, req, extractURL)
    }
}
function extractURL(val, res, req) {
    var routing = basedir;
    var url = req.url;
    url = basedir + url;
    console.log(url);
    if (fs.existsSync(url)) {
        if (supported[path.extname(url)]) {
            sendFile(url, supported[path.extname(url)], res, endCon);
        } else {
            res.writeHeader(403, { "Content-Type": "text/html" });
            endCon(res);
        }
    } else {
        res.writeHeader(403, { "Content-Type": "text/html" });
        endCon(res);
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

function checkPasswd(uname, passwd, req, res) {
    console.log("SELECT passwd FROM test WHERE uname=\"" + uname + "\";");
    db.get("SELECT passwd FROM test WHERE uname=\"" + uname+"\";", function (err, row) {
        if (row.passwd === undefined) {
            
            console.log("Nutzer nicht vorhanden");
        } else if (row.passwd === passwd) {
            req.session.data.user = uname;
            console.log("Zugang für user" + uname + " gewähren");
        } else {
            console.log("Passwort falsch");
        }
    });
}

function testSessionValid(res, req, callback) {
}

var server = http.createServer(handleRequest);

server.listen(1337);
console.log('Server startet');
var db = new sqlite3.Database('neu.db');