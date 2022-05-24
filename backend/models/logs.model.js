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

const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
    "ip": {type: String, required: true},
    "userAgent": {type: String, required: true},
    "datetime": {type: Date, required: true},
    "method": {type: String, required: true},
    "url": {type: String, required: true}
});
const Log = mongoose.model('Log', LogSchema);
module.exports = Log;