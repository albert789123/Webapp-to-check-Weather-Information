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

const CommentSchema = mongoose.Schema({
    "user": {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    "location": {type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true},
    "comment": {type: String, required: true},
    "emotion": {type: String, required: true}
}, {timestamps: true});
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;