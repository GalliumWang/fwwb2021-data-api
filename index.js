

var express = require('express');
var app = express();
var parse = require('csv-parse');
var fs = require("fs");

var stationData;
var parser = parse({columns: true}, function (err, records) {
    console.log("station data file loaded");
    stationData=records;
});
fs.createReadStream(__dirname+'/data/station.csv').pipe(parser);

app.get('/station', function (req, res) {
    var stationId=req.query.id;
    var stationName=req.query.name;

    if(!(stationId^stationName)){
        res.status(400).send({ error: "invalid parameters numbers!" });
    }
    else if(stationId){
        for(record of stationData){
            if(record["编号"]==stationId) {
            res.send(record);
            return;
            }
        }
        res.status(400).send({ error: "invalid id parameter" });
    }
    else{
        for(record of stationData){
            if(record["站点名称"]==stationName) {
                res.send(record);
                return;
                }
        }
        res.status(400).send({ error: "invalid name parameter" });
    }
    res.end();
    return;
})

var server = app.listen(2021, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("app listening at http://%s:%s", host, port)
})