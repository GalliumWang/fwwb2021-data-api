var express = require('express');
var app = express();
var parse = require('csv-parse');
var fs = require("fs");

// TODO:set json type in header

async function loadCsvData(filePath){
    var data;

    let dataPromise = new Promise(function(resolve,reject){

        var filePathArray=filePath.split("/");
        var fileName=filePathArray[filePathArray.length-1];
    
        var parser = parse({columns: true}, function (err, records) {
            console.log(`csv data file (${fileName}) loaded`);
            resolve(records);
        });

        fs.createReadStream(__dirname+filePath).pipe(parser);

    });

    var data=await dataPromise;
    return data;
}

var stationData;
loadCsvData("/data/station.csv").then((result)=>{
    stationData=result;
});

var tripData;
loadCsvData("/data/trips.csv").then((result)=>{
    tripData=result;
});

var userData;
loadCsvData("/data/users.csv").then((result)=>{
    userData=result;
});

var workdayData;
loadCsvData("/data/workdays2020.csv").then((result)=>{
    workdayData=result;
});


app.get('/station', function (req, res) {
    var queryFilter=req.query.filter;
    if(typeof queryFilter=="undefined"){
        res.status(400).send({ error: "query filter not set!" });
        return;
    }
    else if(queryFilter=="None"){
        res.send(JSON.stringify(stationData));
        return;
    }
    else if(queryType=="id"){
        var stationId=req.query.id;
        if(typeof stationId=="undefined"){
            res.status(400).send({ error: "id parameter not set!" });
            return;
        }
        for(record of stationData){
            if(record["编号"]==stationId) {
            res.send(record);
            return;
            }
        }
        res.status(400).send({ error: "record not found" });
        return;

    }
    else if(queryType=="name"){
        var stationName=req.query.name;
        if(typeof stationName=="undefined"){
            res.status(400).send({ error: "name parameter not set!" });
            return;
        }
        for(record of stationData){
            if(record["站点名称"]==stationName) {
                res.send(record);
                return;
                }
        }
        res.status(400).send({ error: "record not found" });
        return;
    }
    else{
        res.status(400).send({ error: "invalid query type!" });
    }
})

app.get('/trip', function (req, res) {
})


var server = app.listen(2021, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("app listening at http://%s:%s", host, port)
})