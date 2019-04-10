'use strict'
let { ITEMS_PER_PAGE } = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');
let fs = require('fs');
let path = require('path');

// Load models
let Publication = require('../models/publication.model');
let User = require('../models/user.model');
let Follow = require('../models/follow.model');
let Comment = require('../models/comment.model');

const POST_PATH = './uploads/posts/';

function savePublication(req, res) {
    let params = req.body;

    let publication = new Publication();

    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The post can not be saved' });

        if (!publicationStored) return res.status(404).send({ message: 'The post can not be saved.' });

        return res.status(200).send({ publication: publicationStored });
    });
}

function getPublications(req, res) {
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error in the request. It can not be get the followed users' });

        let followsClean = [];

        follows.forEach((follow) => {
            followsClean.push(follow.followed);
        });

        followsClean.push(req.user.sub);

        Publication.find({ user: { "$in": followsClean } })
            .sort('-created_at')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'name surname picture _id' }
            })
            .populate('user', 'name surname picture _id')
            .paginate(page, ITEMS_PER_PAGE, (err, publications, total) => {

                if (err) return res.status(500).send({ message: 'Error in the request. It can not be get the publications' });

                if (!publications) return res.status(404).send({ message: 'There are no publications' });

                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / ITEMS_PER_PAGE),
                    itemsPerPage: ITEMS_PER_PAGE,
                    publications
                });
            });
    });
}

function getUserPublications(req, res) {
    let page = 1;
    let userId = req.params.id;

    if (req.params.page) {
        page = req.params.page;
    }

    Publication.find({ user: userId })
        .sort('-created_at')
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'name surname picture _id' }
        })
        .paginate(page, ITEMS_PER_PAGE, (err, publications, total) => {

            if (err) return res.status(500).send({ message: 'Error in the request. It can not be get the publications' });

            if (!publications) return res.status(404).send({ message: 'There are no publications' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / ITEMS_PER_PAGE),
                itemsPerPage: ITEMS_PER_PAGE,
                publications
            });
        });
}


function getPublication(req, res) {
    let publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Error in the request. It can not be get the publication' });

        if (!publication) return res.status(404).send({ message: 'There are no publication' });

        return res.status(200).send({ publication });
    });
}

function deletePublication(req, res) {
    let publicationId = req.params.id;

    Publication.findByIdAndRemove({ user: req.user.sub, '_id': publicationId }, (err, publicationRemoved) => {
        if (err) return res.status(500).send({ message: 'Error in the request. It can not be removed the publication' });

        if (!publicationRemoved) return res.status(404).send({ message: 'The publication has not been removed' });

        Comment.remove({'_id':{'$in':publicationRemoved.comments}}, (err)=> {
            if(err){
                return res.status(500).send({ message: 'Error in the request. It can not be removed the publication comments' });
            }

            return res.status(200).send({ publication: publicationRemoved });
        })

    });
}

function uploadPublicationFile(req, res) {
    let publicationId = req.params.id;
    let filePath = req.file.path;
    let filename = req.file.filename;

    if (req.file) {

        Publication.findOne({ user: req.user.sub, '_id': publicationId }, (err, publication) => {

            if (publication) {

                Publication.findByIdAndUpdate(publicationId, { file: filename }, { new: true }, (err, publicationUpdated) => {

                    if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The publication can not be upadated');

                    if (!publicationUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The publication has not been updated');

                    return res.status(200).send({ publication: publicationUpdated });
                });

            } else {
                return removeFilesOfUpdates(res, 403, filePath, 'You do not have permission to update user data');
            }
        });
    } else {
        return res.status(200).send({ message: 'No file has been uploaded' })
    }
}

function updatePublicationComments(req, res) {
    let publicationId = req.params.id;
    let commentId = req.body._id;

    Publication.findByIdAndUpdate( publicationId, { '$addToSet': { comments: commentId } }, { new: true }, (err, publicationUpdated) => {
        if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The publication can not be upadated');

        if (!publicationUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The publication has not been updated');

        return res.status(200).send({ publication: publicationUpdated });
    });

}

function updatePublication(req, res) {
    let publication = req.params.id;    

    Publication.findByIdAndUpdate( publicationId, { '$addToSet': { comments: commentId } }, { new: true }, (err, publicationUpdated) => {
        if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The publication can not be upadated');

        if (!publicationUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The publication has not been updated');

        return res.status(200).send({ publication: publicationUpdated });
    });

}

function getPublicacionFile(req, res) {
    let file = req.params.file;
    let pathFile = path.resolve(POST_PATH, file);

    fs.stat(pathFile, (err, stat) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(200).send({ message: 'The image does not exits' });
            } else { // en caso de otro error
                return res.status(500).send({ message: 'Error requesting the image.' });
            }
        }
        return res.sendFile(pathFile);
    });
}

async function removeFilesOfUpdates(res, httpCode, filePath, message) {
    await fs.unlink(filePath, (err) => {
        return res.status(httpCode).send({ message: message })
    });
}

module.exports = {
    getUserPublications,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    updatePublication,
    updatePublicationComments,
    uploadPublicationFile,
    getPublicacionFile
};