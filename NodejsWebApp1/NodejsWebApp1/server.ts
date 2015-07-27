var http = require('http');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3')
var utils = require('util');
var querystring = require('querystring');
var sessions = require('sesh/lib/core').magicSession();

//Basedirectory for the server
var basedir = './www';

//supported filetypes
var supported = {
    ".html": "text/html",
    ".css": "text/css"
}

//Analytical functions and ending the response
function endCon (res) {
        res.end();
    }

//Handles all incomming requests
function handleRequest(req, res) {
    var routing = basedir;
    var url = req.url;
    if (url === '/') {
        testSessionValid(res, req, extractURL);
    } else if (url === '/style/loginstyle.css') {
        sendFile('./www' + url, supported[path.extname(url)], 200, res, endCon);
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
        } else {
            sendFile('./www/login.html' + url, supported[path.extname(url)], 405, res, endCon);
        }
    } else {
        testSessionValid(res, req, extractURL)
    }
}

//Extracts the URL and checks the content
function extractURL(res, req, val) {
    var routing = basedir;
    var url = req.url;
    url = basedir + url;
    if (fs.existsSync(url)) {
        if (supported[path.extname(url)] && val) {
            if (url === './www/' || url === './www/login.html') {
                sendFile('./www/myPage.html', supported[path.extname(url)], 200, res, endCon);
            } else {
                sendFile(url, supported[path.extname(url)], 200, res, endCon);
            }
        } else {
            sendFile('www/login.html', "text/html", 200, res, endCon);
        }
    } else {
        sendFile('www/login.html', "text/html", 200, res, endCon);
    }
}

//sending the requested file, after authentication finished
function sendFile(file, type, statcode, res, callback) {
    fs.readFile(file, function (err, html) {
        if (err) {
            throw err;
        } else {
            res.writeHeader(statcode, { "Content-Type": type });
            res.write(html);
            callback(res);
        }
    });
}

//compares password to databaseentry given by users, not save
function checkPasswd(uname, passwd, req, res) {
    db.get("SELECT passwd FROM test WHERE uname=\"" + uname + "\";", function (err, row) {
        if (typeof row !== 'undefined') {
            if (row.passwd === passwd) {
                req.session.data.user = uname;
                console.log('hue');
                sendFile("./www/myPage.html", "text/html", 200, res, endCon);
            } else {
                sendFile("./www/login.html", "text/html", 401, res, endCon);
            }
        } else {
            sendFile("./www/login.html", "text/html", 401, res, endCon);
        }
    });
}

//Easy Identitycheck, not too save
function testSessionValid(res, req, callback) {
    if (req.session.data.user != 'Guest') {
        callback(res, req, true);
    } else {
        callback(res, req, false);
    }
}

//starting server and database
var server = http.createServer(handleRequest);
server.listen(1337);
console.log('Server startet');
var db = new sqlite3.Database('neu.db');