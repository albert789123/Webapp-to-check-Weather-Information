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

const User = require('../models/users.model');
const { decodeToken } = require('../utils/token');

const tokenValidator = async (req, res, next)=>{
    // TODO: set req.user to the User record if a valid JWT or session ID is presented
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token != null){
        try{
            const { id } = decodeToken(token);
            const user = await User
                .findById(id)
                .populate('favLocations')
                .exec();
            if (user == null) throw new Error("No user record found");
            else req.user = user;
        }catch(error){
            console.error("Token Validation Error: "+error.message);
        }
    }
    next();
};
module.exports = tokenValidator;