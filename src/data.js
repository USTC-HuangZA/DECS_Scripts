const parse =require('csv-parse/lib/sync');
const fs = require('fs');
let input = fs.readFileSync("./count_observation_upload.csv");
let configure = JSON.parse(fs.readFileSync("./configFile.json"));

let records = parse(input, {
    columns: true,
    skip_empty_lines: true
});
let groupByID= {};
for(let i of records){
    if(groupByID[i.videoId]) groupByID[i.videoId].push({'viewCount':i.viewCount,'Time':i.Time});else groupByID[i.videoId]=[{'viewCount':i.viewCount,'Time':i.Time}]
}
let fileAccessRecord = [];
let accessRecordTemp = [];
let ipCounter = 0;
let fileCounter = 0;
let ipNum = configure['ipNum'];
let fileMinSize = configure['fileMinSize'];
let fileMaxSize = configure['fileMaxSize'];
for (let key in groupByID){

    if(key){
        let data = groupByID[key];
        let usage = [];
        let formal = true;
        for(let i=1;i<200;i++){
            let minus = Number(data[i].viewCount)-Number(data[i-1].viewCount);
            if(minus<0) {
                console.log(`name:${key} time:${i} last: ${Number(data[i].viewCount)} now ${Number(data[i-1].viewCount)}`);
                formal = false;
            }
            else{
                usage.push(minus);
            }
        }
        if(formal){
            accessRecordTemp.push({ipNum:ipCounter,accessAmount:usage});
            if(ipCounter === ipNum -1) {
                fileAccessRecord.push({fileName: fileCounter, fileSize: Math.random() * (fileMaxSize - fileMinSize) + fileMinSize ,accessRecord: Array.from(accessRecordTemp)});
                fileCounter = fileCounter+1;
                accessRecordTemp = [];
            }
            ipCounter = (ipCounter+1)%ipNum;
        }
    }
}
fs.writeFileSync('transformedData.json',JSON.stringify(fileAccessRecord));

