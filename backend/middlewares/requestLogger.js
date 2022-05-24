/*
Student ID | Name
-----------------------
1155127438 | HONG Kai Yin 
1155141990 | NG Wing Ki Vickie
1155142639 | LAM Yan Yu
1155127411 | WONG Sai Ho
1155127379 | Tang Siu Cheong
1155133623 | Ho Lee Lee
*/

const moment = require('moment');
const fs = require('fs');
const Log = require('../models/logs.model');
const { log_filename } = require('../config.json');

const requestLogger = (req, res, next)=>{
    const protocol = req.protocol;
    const hostname = req.get('host');
    const path = req.originalUrl;
    const fullUrl = protocol + "://" + hostname + path;
    const method = req.method;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const datetime = moment().toDate();

    Log.create({
        "ip": ip,
        "userAgent": userAgent,
        "datetime": datetime,
        "method": method,
        "url": fullUrl
    });

    const logEntry = `[${datetime.toString()}] Request: ${method} ${fullUrl}; IP: ${ip}; UserAgent: ${userAgent}`;

    fs.appendFile(log_filename, logEntry+"\n", (err)=>{
        if (err) console.log("Log Entry Error: "+err.message);
    });

    console.log(logEntry);
    next();
}
module.exports = requestLogger;