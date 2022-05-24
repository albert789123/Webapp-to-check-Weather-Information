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
const express = require('express');
require('express-async-errors');
const router = express.Router();
const User = require('../models/users.model');
const Pollution = require("../models/pollutions.model");
const Location = require('../models/locations.model');
const Comment = require('../models/comments.model');
const { HttpAlreadyExistedError, HttpNotFoundError, HttpInvalidArgumentError, HttpNotLoggedInError, HttpInternalServerError, HttpForbiddenError } = require('../errors/HttpErrors');
const fetchPollutionInfo = require('../utils/fetchData');

// Default Weather Station Information
const stations = require('../misc/weather_stations.json');
const pollutionPopulateOptions = { sort: { 'datetime': -1 }, limit: 24};
const commentPopulateOptions = { sort: {'updatedAt': -1 }, limit: 20};

// GET /locations
router.get('/', async (req, res)=>{
    const refreshPollutions = req.query['refreshPollutions'];
    await fetchPollutionInfo(refreshPollutions);
    const locations = await Location.find({}).populate([{
        path: 'pollutions',
        options: pollutionPopulateOptions
    }, {
        path: 'comments',
        select: '-location',
        options: commentPopulateOptions
    }]).exec();
    res.status(200).send(locations);
});

// GET /locations/:locId
router.get('/:locId', async (req, res)=>{
    const refreshPollutions = req.query['refreshPollutions'];
    await fetchPollutionInfo(refreshPollutions);
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else{
        const location = await Location.findById(locId).populate([{
                path: 'pollutions',
                options: pollutionPopulateOptions
            }, {
                path: 'comments',
                select: '-location',
                options: commentPopulateOptions
            }]).exec();
        if (location == null) throw new HttpNotFoundError("Location Not Found!");
        else res.status(200).send(location);
    }
});

// POST /locations
router.post('/', async (req, res)=>{
    const { name, long, lat, address } = req.body;

    const isLocationExisted = await Location.exists({"name": name}).exec();
    if (isLocationExisted != null) throw new HttpAlreadyExistedError("Location Already Existed!");
    else{
        const newLocation = await Location.create({
            "name": name,
            "lat": lat,
            "long": long,
            "address": address
        });
    
        res.status(201).send(newLocation);
    }
});

// PATCH /locations/:locId
router.patch('/:locId', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else{
        const { name, lat, long, address, ...rest } = req.body;
        const isLocationExisted = await Location.exists({ _id: locId }).exec();
        if (isLocationExisted == null) throw new HttpNotFoundError("Location Not Found!");
        else if (name && typeof name != 'string') throw new HttpInvalidArgumentError("Invalid Location Name!");
        else if (lat && typeof lat != 'number') throw new HttpInvalidArgumentError("Invalid Location Latitude!");
        else if (long && typeof long != 'number') throw new HttpInvalidArgumentError("Invalid Location Longitude!");
        else if (address && typeof address != 'string') throw new HttpInvalidArgumentError("Invalid Location Address!");
        else{
            const updateFilter = {};
            if (name) updateFilter['name'] = name;
            if (lat) updateFilter['lat'] = lat;
            if (long) updateFilter['long'] = long;
            if (address) updateFilter['address'] = address;
            const result = await Location.updateOne({_id: locId}, updateFilter).exec();
            const updatedLocation = await Location.findById(locId).populate([{
                path: 'pollutions',
                options: pollutionPopulateOptions
            }, {
                path: 'comments',
                select: '-location',
                options: commentPopulateOptions
            }]).exec();
            res.status(200).send(updatedLocation);
        }
    }
    

});

// DELETE /locations/:locId
router.delete('/:locId', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else if (!req.user.isAdmin) throw new HttpForbiddenError("User Not Admin!");
    else{
        const result = await Location.deleteOne({_id: locId}).exec();
        if (result.deletedCount <= 0) throw new HttpNotFoundError("Location Not Found!");
        else{
            const pollutionResult = await Pollution.deleteMany({ location: locId }).exec();
            const commentResult = await Comment.deleteMany({ location: locId }).exec();
            const favLocationsResult = await User.updateMany(
                { favLocations: locId },
                { $pull: { favLocations: locId } }
            ).exec();
            res.status(204).send("");
        }
    }
    
});

// PUT /locations/load
router.put('/load', async (req, res)=>{
    for (let i=0; i<stations.length; i++){
        const isLocationExisted = await Location.exists({"name": stations[i].name}).exec();
        if (isLocationExisted){
            await Location.updateOne(
                {"name": stations[i].name}, 
                {
                    "long": stations[i].long,
                    "lat": stations[i].lat,
                    "address": stations[i].address
                }
            ).exec();
        }else{
            await Location.create({
                "name": stations[i].name,
                "long": stations[i].long,
                "lat": stations[i].lat,
                "address": stations[i].address
            });
        }
    }

    const result = await Location.find({}).populate([{
        path: 'pollutions',
        options: pollutionPopulateOptions
    }, {
        path: 'comments',
        select: '-location',
        options: commentPopulateOptions
    }]).exec();
    res.status(200).send(result);

});

// GET /locations/:locId/pollutions
router.get('/:locId/pollutions', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");{
        const isLocationExisted = await Location.exists({_id: locId}).exec();
        if (isLocationExisted == null) throw new HttpNotFoundError("Location Not Found!");
        else{
            await fetchPollutionInfo();
            const pollutions = await Pollution
                .find({ location: locId })
                .sort("-datetime")
                .skip(0)
                .limit(24)
                .exec();
            res.status(200).send(pollutions);
        }
    }
});

// GET /locations/:locId/comments
router.get('/:locId/comments', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else{
        const isLocationExisted = await Location.exists({_id: locId}).exec();
        if (isLocationExisted == null) throw new HttpNotFoundError("Location Not Found!");
        else{
            const comments = await Comment
                .find({ location: locId })
                .select('-location')
                .sort('-updatedAt')
                .populate({
                    path: 'user',
                    select: 'name'
                })
                .exec();
            res.status(200).send(comments);
        }
    }
});

// POST /locations/:locId/comments
router.post('/:locId/comments', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else{
        const { comment, emotion } = req.body
        const isLocationExisted = await Location.exists({_id: locId}).exec();
        if (isLocationExisted == null) throw new HttpNotFoundError("Location Not Found!");
        else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
        else if (typeof comment != 'string' || comment == "") throw new HttpInvalidArgumentError("Invalid comment!");
        else if (typeof emotion != 'string' || emotion == "") throw new HttpInvalidArgumentError("Invalid emotion");
        else{
            const newComment = await Comment.create({
                "user": req.user._id,
                "location": locId,
                "comment": comment,
                "emotion": emotion
            });
            newComment.populate({
                path: 'user',
                select: 'name'
            });
            const updateResult = await Location.updateOne(
                {_id: locId},
                { $push: { comments: newComment._id } }
            ).exec();
            res.status(201).send(newComment);
        }
    }
});

router.post('/:locId/favourite', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else if ((await Location.exists({ _id: locId }).exec()) == null) throw new HttpNotFoundError("Location Not Found!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else if ((await User.exists({ _id: req.user._id, favLocations: locId }).exec()) != null) throw new HttpAlreadyExistedError("User already has this location in favourite!");
    else{
        const updateResult = await User.updateOne(
            { _id: req.user._id },
            { $push: { favLocations: locId } }
        ).exec();
        if (updateResult.modifiedCount <= 0) throw new HttpInternalServerError("Favourite Not Updated!");
        else res.status(200).send(`Location ${locId} is added to user favourite!`);
    }
});

router.delete('/:locId/favourite', async (req, res)=>{
    const locId = req.params['locId'];
    if (!mongoose.isValidObjectId(locId)) throw new HttpInvalidArgumentError("Invalid Location ID!");
    else if ((await Location.exists({ _id: locId }).exec()) == null) throw new HttpNotFoundError("Location Not Found!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else if ((await User.exists({ _id: req.user._id, favLocations: locId }).exec()) == null) throw new HttpNotFoundError("User does not hav this location in favourite!");
    else{
        const updateResult = await User.updateOne(
            { _id: req.user._id },
            { $pull: { favLocations: locId } }
        ).exec();
        if (updateResult.modifiedCount <= 0) throw new HttpInternalServerError("Favourite Not Updated!");
        else res.status(204).send("");
    }
});

module.exports = router;