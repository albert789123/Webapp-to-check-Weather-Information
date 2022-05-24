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
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    "name": {type: String, required: true, minLength: 4, maxLength: 20, unique: true},
    "password": {type: String, required: true, minLength: 4, maxLength: 20},
    "isAdmin": {type: Boolean, required: true, default: false},
    "favLocations": [{type: mongoose.Schema.Types.ObjectId, ref: 'Location'}],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
  
const User = mongoose.model('User', userSchema);
module.exports = User;
