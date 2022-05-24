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

const PollutionSchema = mongoose.Schema({
    "location": {type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true, select: false},
    "datetime": {type: Date, required: true},
    "no2": {type: Number, default: null},
    "o3": {type: Number, default: null},
    "so2": {type: Number, default: null},
    "co": {type: Number, default: null},
    "pm10": {type: Number, default: null},
    "pm2_5": {type: Number, default: null}
});
const Pollution = mongoose.model('Pollution', PollutionSchema);
module.exports = Pollution;
