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

const express = require('express');
const mongoose = require('mongoose');
const { HttpAlreadyExistedError, HttpInternalServerError, HttpNotFoundError, HttpNotLoggedInError, HttpInvalidArgumentError, HttpForbiddenError } = require('../errors/HttpErrors');
require('express-async-errors');
const User = require('../models/users.model');
const Location = require('../models/locations.model');
const router = express.Router();
const { generateToken, decodeToken } = require('../utils/token');
const Comment = require('../models/comments.model');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res)=>{
    const { name, password } = req.body;

    const userExist = await User.findOne({ name });

    if (userExist) throw new HttpAlreadyExistedError('User alreay exists!');

    const user = await User.create({
        name,
        password
    });

    if (user) {
        res.status(201).send({
            "name": user.name,
            "isAdmin": user.isAdmin,
        });
    }
    else throw new HttpInternalServerError("Unknown Error!");

});

router.post('/login', async (req, res)=>{
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (user && (await user.matchPassword(password))) {
        res.status(201).send({
            "name": user.name,
            "isAdmin": user.isAdmin,
            "token": generateToken(user._id),
        });
    }
    else throw new HttpNotFoundError('Invalid username or password!');

});

router.delete('/:userId', async (req, res)=>{
    const userId = req.params['userId'];
    if (!mongoose.isValidObjectId(userId)) throw new HttpInvalidArgumentError("Invalid User ID!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else if (!req.user.isAdmin) throw new HttpForbiddenError("User Not Admin!");
    else{
        const result = await User.deleteOne({ _id: userId }).exec();
        if (result.deletedCount <= 0) throw new HttpNotFoundError("User Not Found!");
        else{
            const commentResult = await Comment.deleteMany({ user: userId }).exec();
            res.status(204).send("");
        }
    }
});

router.patch('/:userId', async (req, res)=>{
    const userId = req.params['userId'];
    const { name, password }  = req.body;
    if (!mongoose.isValidObjectId(userId)) throw new HttpInvalidArgumentError("Invalid User ID!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else if (!req.user.isAdmin) throw new HttpForbiddenError("User Not Admin!");
    else{
        if((await User.exists({_id: userId}).exec()) == null) throw new HttpNotFoundError("User Not Found!");
        else if (name && typeof name != 'string') throw new HttpInvalidArgumentError("Invalid User Name!");
        else if (password && typeof password != 'string') throw new HttpInvalidArgumentError("Invalid User Password!");
        else{
            const salt = await bcrypt.genSalt(10);
            let pw= await bcrypt.hash(password, salt);
            const updateFilter = {};
            if (name) updateFilter['name'] = name;
            if (password) updateFilter['password'] = pw;
            const result = await User.updateOne({_id: userId}, updateFilter).exec();
            // const user = await User.findById(userId).populate({
            //     path: 'favLocations',
            //     select: '-pollutions -comments'
            // }).exec();
            // if (name) user.name = name;
            // if (password) user.password = password;
            // else user.password = user.password;
            // user.save();
            res.status(200).send(result);
        }
    }
});

router.get('/favourites', async (req, res)=>{
    if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else{
        const favLocations = await User
            .findById(req.user._id)
            .select('favLocations')
            .populate({
                path: 'favLocations',
                select: '-pollutions -comments'
            })
            .exec();
        res.status(200).send(favLocations);
    }
});

router.post('/reset', async (req, res)=>{
    if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else{
        const { resetComments, resetFavLocations } = req.body;
        if (!resetComments && !resetFavLocations) throw new HttpInvalidArgumentError("Either comments or favourite locations should be selected to reset!");

        if (resetComments){
            const comments = await Comment.find({ user: req.user._id }).exec();
            for (let idx in comments){
                const updateLocResult = await Location.updateOne(
                    {},
                    { $pull: { "comments": comments[idx]._id } }
                ).exec();
                const delCommentResult = await Comment.deleteOne({ _id: comments[idx]._id }).exec();
            }
        }

        if (resetFavLocations){
            const delFavLocationsResult = await User.updateOne(
                { _id: req.user._id },
                { favLocations: [] }
            ).exec();
        }

        res.status(204).send("");
    }
});

router.get('/', async (req, res)=>{

    const users = await User.find({}).exec();
    res.status(200).send(users);
});

module.exports = router;