var http = require('http');
const fs = require('fs');
const ical = require('ical'); 

var server = http.createServer(function (req, res) {   
   
    if (req.url == '/restmuell/collection') { //check the URL of the current request
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //res.write(JSON.stringify({ nextDate: new Date("2015-03-25"), daysUntil: 2}));
            
            let nextRestmuellCollection = getNextRestmuellTag();
            console.log("returned")
            console.log(nextRestmuellCollection);
            res.write(JSON.stringify(nextRestmuellCollection));
            res.end();  
    }
    if (req.url == '/weather') { //check the URL of the current request
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({highest_temp_c: 32}));
        res.end();  
}
});

function getNextRestmuellTag()
{
    
    //TODO .ics parsen (https://github.com/jens-maus/node-ical)
    
    // Pfad zur ICS-Datei auf dem Server
    const icsFilePath = 'ics_test/ahornwegaalen.ics';

    let nextdate;
    let daysUntil;
    
    // Lese die ICS-Datei ein
    const data = fs.readFileSync(icsFilePath, { encoding: 'utf8', flag: 'r' });

    console.log('ICS-Datei erfolgreich eingelesen.');
    
      // Parsen der ICS-Daten
      const events = ical.parseICS(data);
    
      // Heutiges Datum
      const today = new Date();
      
      // Nächster Termin
      let nextEvent = null;
      let minTimeDifference = Infinity;
    
      for (const eventId in events) {
        const event = events[eventId];
    
        // Filtere Termine mit dem Eintrag "Restmüll" im summary-Attribut
        if (event.summary && event.summary.includes('Restmüll')) {
          const eventDate = event.start;
    
          // Berechne den Zeitunterschied zum heutigen Datum
          const timeDifference = eventDate.getTime() - today.getTime();
    
          // Überprüfe, ob der Termin in der Zukunft liegt und ob der Zeitunterschied kleiner als der bisher kleinste ist
          if (timeDifference > 0 && timeDifference < minTimeDifference) {
            minTimeDifference = timeDifference;
            nextEvent = event;
          }
        }
      }

      // Überprüfe, ob ein nächster Termin gefunden wurde
      if (nextEvent) {
        // Berechne die Tage bis zum nächsten Termin
        daysUntil = Math.ceil(minTimeDifference / (1000 * 60 * 60 * 24));
        nextdate = nextEvent.start;
        //console.log(nextEvent)
        console.log('Nächster Restmüll-Termin:', nextEvent.start);
        console.log('Tage bis zum nächsten Termin:', daysUntil);

        console.log("TYPE")
        console.log(nextdate)

        return {nextDate: new Date(nextdate), dayUntil: daysUntil}
      } else {
        console.log('Kein Restmüll-Termin gefunden');
      }

}
getNextRestmuellTag();

server.listen(5001);

console.log('Node.js web server at port 5000 is running..')