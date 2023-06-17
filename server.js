var http = require('http'); 

var server = http.createServer(function (req, res) {   
   
    if (req.url == '/restmuell/collection') { //check the URL of the current request
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ nextDate: new Date("2015-03-25"), dayUntil: 2}));
            
            let msg = getNextRestmuellTag();
            //res.write(JSON.stringify(msg));
            //TODO: .ics einlesen, nächste Restmüll Abholung rauslesen und Differenz zwischen jetzt und dem Tag berechnen  
            res.end();  
    }
});

function getNextRestmuellTag()
{
    var json;
    //TODO .ics parsen (https://github.com/jens-maus/node-ical)
    return json;
}

server.listen(5000);

console.log('Node.js web server at port 5000 is running..')