const fs = require('fs');

const configure = JSON.parse(fs.readFileSync("./configFile.json", 'utf-8'));
const fileInfos = JSON.parse(fs.readFileSync("./transformedData.json", 'utf-8'));

let fileList = [];
for(let i of fileInfos){
    fileList.push({fileName: `${i.fileName}`, size: Math.floor(i.fileSize)})
}

const requestData = JSON.stringify(fileList);
console.log(requestData);
sendRequest(requestData,configure['writeConfig']);

function sendRequest(data, config) {
    const options = {
        host: config['host'],
        port: config['port'],
        path: '/write-batch',
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
            'Content-Length':requestData.length
        }
    };
    const http = require("http");

    let req = http.request(options, function (res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);
        let _data = '';
        res.on('data', function (chunk) {
            _data += chunk;
        });
        res.on('end', function () {
            console.log("\n--->>\nresult:", _data)
        });
    });

    req.write(data);
    req.end();
}