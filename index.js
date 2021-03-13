var fs = require('fs'); 
var parse = require('csv-parse');


var parser = parse({columns: true}, function (err, records) {
	console.log(records["编号"]);
	for(record of records){
        console.log(record["编号"]);
    }
});

fs.createReadStream(__dirname+'/data/station.csv').pipe(parser);