var http = require('http');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3')
var utils = require('util');
var querystring = require('querystring');
var sessions = require('sesh/lib/core').magicSession();

//Basedirectory for the server
var basedir = './WGERP/www';

//supported filetypes
var supported = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javaScript",
    ".json": "text/JSON",
}

//Analytical functions and ending the response
function endCon (res) {
        res.end();
    }

//Handles all incomming requests
function handleRequest(req, res) {
    var routing = basedir;
    var url = req.url;
    console.log("[INCOMMING] URL:" + req.url + " ,methode:" + req.method);
    if (url === '/') {
        testSessionValid(res, req, extractURL);
    } else if (url === '/style/loginstyle.css') {
        sendFile(basedir + url, supported[path.extname(url)], 200, res, endCon);
    } else if (url === '/logon') {

        if (req.method === 'POST') {
            var fullBody = '';

            req.on('data', function (chunk) {

                fullBody += chunk.toString();
            });

            req.on('end', function () {

                var data = querystring.parse(fullBody);
                if (data.uname && data.password) {
                    console.log((data.uname) + (data.password));
                    checkPasswd(data.uname, data.password, req, res);
                } 
            });
        } else if (url == '/post') {
            if (req.method === 'POST') {
                var fullBody = '';
                req.on('data', function (chunk) {
                    fullBody += chunk.toString();
                });
                req.on('end', function () {
                    var data = querystring.parse(fullBody);
                    postData(data, res, req, endCon);
                    }
              }
        }
                else {
            sendFile(basedir + '/login.html' + url, supported[path.extname(url)], 405, res, endCon);
        }
    } else if (url === '/newsfeed' && req.method === 'POST') {
        console.log("Accepted request, check creditals")
        testSessionValid(res, req, generateNewsfile);
    } else {
        testSessionValid(res, req, extractURL);
    }
}

function postData(data, res, req, callback) {
    if (data.msg) {
        db.run("SELECT "Stef" AS uname, 1 AS type, "hiiiiii" AS content, "07101994" AS dateCreated, "181000" AS timeCreated, null AS picture, null AS headline");

    }
}

//Extracts the URL and checks the content
function extractURL(res, req, val) {
    var routing = basedir;
    var url = req.url;
    url = basedir + url;
    console.log("toSend:" + url);
    if (fs.existsSync(url)) {
        if (supported[path.extname(url)] && val) {
            if (url === basedir || url === './www/login.html') {
                sendFile(basedir + '/myPage.html', supported[path.extname(url)], 200, res, endCon);
            } else {
                sendFile(url, supported[path.extname(url)], 200, res, endCon);
            }
        } else {
            sendFile(basedir + '/login.html', "text/html", 200, res, endCon);
        }
    } else {
        sendFile(basedir + '/login.html', "text/html", 200, res, endCon);
    }
}

function generateNewsfile(res, req, val) {
    var result = [];
    function fillJSON(err, row) {
        if (err === null) {
            result.push({ "date": row.dateCreated, "headline": row.headline, "name": row.uname, "pic": row.picture, "text": row.content, "time": row.timeCreated, "type": row.type });
        }
    }
    function prepareJSON(err, rows) {
        console.log(rows + " rows found, prepare JSON");
        sendVar(JSON.stringify(result), "text/JSON", 200, res, endCon);
    }
    console.log("Session valid, datas on the way");
    if (val) {
        var prep = 0;
        db.each("SELECT * FROM post", fillJSON, prepareJSON);
    } else {
        console.log("Zugriff Verweigert");
        endCon(res);
    }
}
//sending the requested file
function sendFile(file, type, statcode, res, callback) {
    console.log("sending File:" + file);
    fs.readFile(file, function (err, toSend) {
        if (err) {
            console.log("Die Seite konnte nicht gesendet werden!")
            callback(res);
        } else {
            res.writeHeader(statcode, { "Content-Type": type });
            res.write(toSend);
            callback(res);
        }
    });
}
function sendVar(file, type, statcode, res, callback) {
    res.writeHeader(statcode, { "Content-Type": type });
    res.write(file);
    callback(res);
}
//compares password to databaseentry given by users, not save
function checkPasswd(uname, passwd, req, res) {
    db.get("SELECT passwd FROM test WHERE uname=\"" + uname + "\";", function (err, row) {
        if (typeof row !== 'undefined') {
            if (row.passwd === passwd) {
                req.session.data.user = uname;
                sendFile(basedir + "/myPage.html", "text/html", 200, res, endCon);
            } else {
                sendFile(basedir + "/login.html", "text/html", 401, res, endCon);
            }
        } else {
            sendFile(basedir + "/login.html", "text/html", 401, res, endCon);
        }
    });
}

//Easy Identitycheck, not too save
function testSessionValid(res, req, callback) {
    if (req.session.data.user != 'Guest') {
        callback(res, req, true);
        console.log("valid session");
    } else {
        callback(res, req, false);
        console.log("invalid session");
    }
}

//starting server and database
var server = http.createServer(handleRequest);
server.listen(1337);
console.log('Server startet');
var db = new sqlite3.Database('./WGERP/neu.db', sqlite3.OPEN_READWRITE, notification);

function notification(err) {
    if (err === null) {
        console.log("Database started");
    } else {
        console.log("[CRITICAL] Databaseconnection was NOT successful");
    }
}
