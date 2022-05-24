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

const { HttpError } = require('../errors/HttpErrors');

// Error Middleware
const errorHandler = (err, req, res, next)=>{
    if (err instanceof HttpError) res.status(err.statusCode()).send(err.errorMessage());
    else if ((err instanceof Error) || (err && err.stack && err.message)) res.status(500).send("Server Error: "+err.message);
    else res.status(500).send("Unknown Server Error!");
}
module.exports = errorHandler;