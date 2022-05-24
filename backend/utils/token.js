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

const config = require('../config.json');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, config.token_secret);
};

function decodeToken(token){
  return jwt.verify(token, config.token_secret);
};

module.exports =  { generateToken, decodeToken };