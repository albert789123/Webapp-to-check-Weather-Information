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
const { HttpInvalidArgumentError, HttpNotFoundError, HttpNotLoggedInError } = require('../errors/HttpErrors');
require('express-async-errors');
const router = express.Router();
const Location = require('../models/locations.model');
const Comment = require('../models/comments.model');

// DELETE /comments/:commentId
router.delete('/:commentId', async (req, res)=>{
    const commentId = req.params['commentId'];
    if (!mongoose.isValidObjectId(commentId)) throw new HttpInvalidArgumentError("Invalid Comment ID!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else{
        let result = { deletedCount: 0 };
        if (req.user.isAdmin) result = await Comment.deleteOne({ _id: commentId }).exec();
        else result = await Comment.deleteOne({ _id: commentId, user: req.user._id }).exec();

        if (result.deletedCount <= 0) throw new HttpNotFoundError("Comment Not Found!");
        else{
            const updateLocResult = await Location.updateOne(
                {},
                { $pull: { comments: commentId } }
            ).exec();
            res.status(204).send("");
        }
    }
});

// PATCH /comments/:commentId
router.patch('/:commentId', async (req, res)=>{
    const commentId = req.params['commentId'];
    if (!mongoose.isValidObjectId(commentId)) throw new HttpInvalidArgumentError("Invalid Comment ID!");
    else if (req.user == null) throw new HttpNotLoggedInError("User Not Logged In!");
    else{
        const { comment, emotion } = req.body;
        const isCommentExisted = await Comment.exists({ _id: commentId, user: req.user._id }).exec();
        if (isCommentExisted == null) throw new HttpNotFoundError("Comment Not Found!");
        else if (comment && (typeof comment != 'string' || comment == "")) throw new HttpInvalidArgumentError("Invalid comment!");
        else if (rating && (typeof emotion != 'string' || emotion == "")) throw new HttpInvalidArgumentError("Invalid emotion!");
        else{
            const updateFilter = {};
            if (comment) updateFilter['comment'] = comment;
            if (rating) updateFilter['emotion'] = emotion;
            const result = await Comment.updateOne({ _id: commentId, user: req.user._id }, updateFilter).exec();
            const updatedComment = await Comment
                .findById(commentId)
                .populate({ 
                    path: 'user',
                    select: 'name'
                 })
                 .exec();
            res.status(200).send(updatedComment);
        }
    }
});

module.exports = router;