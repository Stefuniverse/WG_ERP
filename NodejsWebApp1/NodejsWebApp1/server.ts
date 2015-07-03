var http = require('http');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var utils = require('util');
var querystring = require('querystring');


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
			//password-check
                    console.log(data.uname+data.password);
                    

                }
            });
        }

    } else {
        url = basedir + url;
        console.log(url);
        if (fs.existsSync(url)) {
            if (supported[path.extname(url)]) {
                sendFile(url, supported[path.extname(url)],200, res, endCon);
            } else {
		sendFile("403.html","text/html",403, res, endCon);
            }
        } else {
	    sendFile("404.html","text/html",404, res, endCon);
            res.end();
        }
    }
    console.log(req.method);
}

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

function checkPasswd(uname, passwd) {
    db.run("SELECT passwd FROM test WHERE uname=" + uname);
}

var server = http.createServer(handleRequest);

server.listen(1337);
console.log('Server startet');
var db = new sqlite3.Database(./neu.db);
//db.run("CREATE TABLE test (uname TEXT, passwd TEXT)"), function () {
  //  db.run("INSERT INTO test VALUES (Stef,test)");
};
