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
    else if(queryFilter=="id"){
        var stationId=req.query.id;
        if(typeof stationId=="undefined"){
            res.status(400).send({ error: "id parameter not set!" });
            return;
        }
        for(record of stationData){
            if(record["编号"]==stationId) {
            res.send(JSON.stringify([record]));
            return;
            }
        }
        res.status(400).send({ error: "record not found" });
        return;

    }
    else if(queryFilter=="name"){
        var stationName=req.query.name;
        if(typeof stationName=="undefined"){
            res.status(400).send({ error: "name parameter not set!" });
            return;
        }
        for(record of stationData){
            if(record["站点名称"]==stationName) {
                res.send(JSON.stringify([record]));
                return;
                }
        }
        res.status(400).send({ error: "record not found" });
        return;
    }
    else{
        res.status(400).send({ error: "invalid filter type!" });
    }
})

app.get('/trip', function (req, res) {
    var queryFilter=req.query.filter;
    if(typeof queryFilter=="undefined"){
        res.status(400).send({ error: "query filter not set!" });
        return;
    }
    else if(queryFilter=="None"){
        res.send(JSON.stringify(tripData));
        return;
    }
    else if(queryFilter=="user_id"){
        var userId=req.query.user_id;
        if(typeof userId=="undefined"){
            res.status(400).send({ error: "user_id parameter not set!" });
            return;
        }
        result=tripData.filter((record)=>{
            return record["用户ID"]==userId;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else if(queryFilter=="in_station_name"){
        var inStationName=req.query.in_station_name;
        if(typeof inStationName=="undefined"){
            res.status(400).send({ error: "in_station_name parameter not set!" });
            return;
        }
        result=tripData.filter((record)=>{
            return record["进站名称"]==inStationName;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else if(queryFilter=="out_station_name"){
        var outStationName=req.query.out_station_name;
        if(typeof outStationName=="undefined"){
            res.status(400).send({ error: "out_station_name parameter not set!" });
            return;
        }
        result=tripData.filter((record)=>{
            return record["出站名称"]==outStationName;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else if(queryFilter=="prize"){
        var prize=req.query.prize;
        if(typeof prize=="undefined"){
            res.status(400).send({ error: "prize parameter not set!" });
            return;
        }
        result=tripData.filter((record)=>{
            return record["价格"]==prize;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else{
        res.status(400).send({ error: "invalid filter type!" });
    }
})

app.get('/user', function (req, res) {
    var queryFilter=req.query.filter;
    if(typeof queryFilter=="undefined"){
        res.status(400).send({ error: "query filter not set!" });
        return;
    }
    else if(queryFilter=="None"){
        res.send(JSON.stringify(tripData));
        return;
    }
    else if(queryFilter=="id"){
        var id=req.query.id;
        if(typeof id=="undefined"){
            res.status(400).send({ error: "id parameter not set!" });
            return;
        }
        for(record of userData){
            if(record["用户ID"]==id) {
                res.send(JSON.stringify([record]));
                return;
                }
        }
        res.status(400).send({ error: "record not found" });
        return;
    }
    else if(queryFilter=="location"){
        var location=req.query.location;
        if(typeof location=="undefined"){
            res.status(400).send({ error: "location parameter not set!" });
            return;
        }
        result=userData.filter((record)=>{
            return record["区域"]==location;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else if(queryFilter=="birth_year"){
        var birthYear=req.query.birth_year;
        if(typeof birthYear=="undefined"){
            res.status(400).send({ error: "birth_year parameter not set!" });
            return;
        }
        result=userData.filter((record)=>{
            return record["出生年份"]==birthYear;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else if(queryFilter=="gender"){
        var gender=req.query.gender;
        if(typeof gender=="undefined"){
            res.status(400).send({ error: "gender parameter not set!" });
            return;
        }
        result=userData.filter((record)=>{
            return record["性别"]==gender;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else{
        res.status(400).send({ error: "invalid filter type!" });
    }
})

app.get('/workday', function (req, res) {
    var queryFilter=req.query.filter;
    if(typeof queryFilter=="undefined"){
        res.status(400).send({ error: "query filter not set!" });
        return;
    }
    else if(queryFilter=="None"){
        res.send(JSON.stringify(tripData));
        return;
    }
    else if(queryFilter=="date"){
        var date=req.query.date;
        if(typeof date=="undefined"){
            res.status(400).send({ error: "date parameter not set!" });
            return;
        }
        for(record of workdayData){
            if(record["日期"]==date) {
                res.send(JSON.stringify([record]));
                return;
                }
        }
        res.status(400).send({ error: "record not found" });
        return;
    }
    else if(queryFilter=="attribute"){
        var attribute=req.query.attribute;
        if(typeof attribute=="undefined"){
            res.status(400).send({ error: "attribute parameter not set!" });
            return;
        }
        result=userData.filter((record)=>{
            return record["属性"]==attribute;
          });
        res.send(JSON.stringify(result));
        return;
    }
    else{
        res.status(400).send({ error: "invalid filter type!" });
    }
})


var server = app.listen(2021, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("app listening at http://%s:%s", host, port)
})