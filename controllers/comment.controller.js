'use strict'
let { ITEMS_PER_PAGE } = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');

// Load models
let Comment = require('../models/comment.model');


function saveComment(req, res) {
    let params = req.body;

    let comment = new Comment();

    comment.text = params.text;
    comment.user = params.user;
    comment.score = params.score;
    comment.created_at = moment().unix();
    
    comment.save((err, commentStored) => {
        if (err) return res.status(500).send({ message: 'The comment can not be saved' });

        if (!commentStored) return res.status(404).send({ message: 'The comment has not been saved' });

        return res.status(200).send({ comment: commentStored });
    });

}

function updateComment(req, res) {
    let commentId = req.params.id;
    let updateData = req.body;

    updateData.created_at = moment().unix();

    Comment.findByIdAndUpdate(commentId, updateData, { new: true }, (err, commentUpdated) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The comment can not be updated' });

        if (!commentUpdated) return res.status(404).send({ message: 'The comment has not been updated' });

        return res.status(200).send({ comment: commentUpdated });
    });
}

function deleteComment(req, res) {
    let commentId = req.params.id;

    Comment.findByIdAndRemove( commentId, (err, commentRemoved) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The comment can not be removed ' });

        if (!commentRemoved) return res.status(404).send({ message: 'The comment can not be removed, it has not been found' });

        return res.status(200).send({comment: commentRemoved});
    });
}

module.exports = {
    saveComment,
    updateComment,
    deleteComment
}