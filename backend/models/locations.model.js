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

const LocationSchema = mongoose.Schema({
    "name": {type: String, required: true, unique: true},
    "long": {type: Number, required: true},
    "lat": {type: Number, required: true},
    "address": {type: String, default: null},
    "pollutions": [{type: mongoose.Schema.Types.ObjectId, ref: 'Pollution'}],
    "comments": [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});
const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;
