'use strict'
let { ITEMS_PER_PAGE } = require('../config');
const RESOURCE_PATH = './uploads/resources/';

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');
let fs = require('fs');
let path = require('path');

// Load models
let Resource = require('../models/resource.model');
let Comment = require('../models/comment.model');


function saveResource(req, res) {
    let params = req.body;

    let resource = new Resource();

    resource.name = params.name;
    resource.type = params.type; // [ document, video, link, software]
    resource.description = params.description;
    resource.source = params.source;
    resource.justification = params.justification;
    resource.author = params.author;
    resource.accepted = params.accepted;
    resource.created_at = moment().unix();    
    resource.url = params.url;

    resource.save((err, resourceStored) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The resource can not be saved' });

        if (!resourceStored) return res.status(404).send({ message: 'The resource has not been saved' });

        return res.status(200).send({ resource: resourceStored });
    });
}

function uploadResourceFile(req, res){
    let resourceId = req.params.id;
    let filePath = req.file.path;
    let filename = req.file.filename;

    if (req.file) {

        Resource.findOne({'_id': resourceId }, (err, resource) => {

            if (resource) {

                Resource.findByIdAndUpdate(resourceId, { file: filename }, { new: true }, (err, resourceUpdated) => {

                    if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The resource can not be upadated');

                    if (!resourceUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The resource has not been updated');

                    return res.status(200).send({ resource: resourceUpdated });
                });

            } else {
                return removeFilesOfUpdates(res, 403, filePath, 'You do not have permission to update user data');
            }
        });
    } else {
        return res.status(200).send({ message: 'No file has been uploaded' })
    }
}

function getResourceFile(req, res){
    let file = req.params.file;
    let pathFile = path.resolve(RESOURCE_PATH, file);

    fs.stat(pathFile, (err, stat) => {

        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(200).send({ message: 'The file does not exits' });
            } else { // en caso de otro error
                return res.status(500).send({ message: 'Error requesting the file.' });
            }
        }
        return res.sendFile(pathFile);
    });
}

function deleteResource(req, res) {
    let resourceId = req.params.id;

    Resource.findByIdAndRemove({ user: req.user.sub, '_id': resourceId }, (err, resourceRemoved) => {
        if (err) return res.status(500).send({ message: 'Error in the request. It can not be removed the resource' });

        if (!resourceRemoved) return res.status(404).send({ message: 'The resource has not been removed' });

        Comment.remove({'_id':{'$in':resourceRemoved.comments}}, (err)=> {
            if(err){
                return res.status(500).send({ message: 'Error in the request. It can not be removed the resource comments' });
            }

            return res.status(200).send({ resource: resourceRemoved });
        })

    });
}

function updateResource(req, res) {
    var resourceId = req.params.id;
    var updateData = req.body;

    Resource.findByIdAndUpdate(resourceId, updateData, {new:true}, (err, resourceUpdated) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The resource can not be updated' });

        if (!resourceUpdated) return res.status(404).send({ message: 'The resource has not been updated' });

        return res.status(200).send({ resource: resourceUpdated });
    });
}

function getResources(req, res) {
    var page = req.params.page;
    let findQuery = {
        accepted: true
    };

    if(req.params.visibleOnes == 'true'){
        findQuery.visible = true;
    }

    Resource.find(findQuery)
    .sort('name')
    .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name surname picture _id' }
    })
    .populate('author', 'name surname picture _id')
    .paginate(page, ITEMS_PER_PAGE, (err, resources, total) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The resources were not found' });

        if (!resources) return res.status(404).send({ message: 'No resources were found' });

        return res.status(200).send({
            resources: resources,
            total: total,
            pages: Math.ceil(total / ITEMS_PER_PAGE)
        });
    });
}

function getAllResources(req, res) {
    let order = `-${req.params.order}`;
    let findQuery = {
        accepted: true
    };

    if(req.params.visibleOnes == 'true'){
        findQuery.visible = true;
    }

    if(!req.params.order){
        order = 'name';
    }    

    Resource.find(findQuery).sort(order)
    .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name surname picture _id' }
    })
    .populate('author', 'name surname picture _id')
    .exec((err, resources) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The resources were not found' });

        if (!resources) return res.status(404).send({ message: 'No resources were found' });

        return res.status(200).send({ resources: resources });

    });
}


// A suggest resource is the one that has "accepted" in false
function getSuggestResources(req, res) {
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    Resource.find({accepted: false })
    .populate('author', 'name surname picture _id')
    .sort('name').paginate(page, ITEMS_PER_PAGE, (err, resources, total) => {
        if (err) return res.status(500).send({ message: 'Error in the request. Could not get records' });

        if (!resources) return res.status(404).send({ message: 'It was not found any record' });

        return res.status(200).send({
            resources,
            total,
            pages: Math.ceil(total / ITEMS_PER_PAGE)
        });
    });
}

async function removeFilesOfUpdates(res, httpCode, filePath, message) {
    await fs.unlink(filePath, (err) => {
        return res.status(httpCode).send({ message: message })
    });
}

module.exports = {
    saveResource,
    uploadResourceFile,
    getResourceFile,
    deleteResource,
    updateResource,
    getResources,
    getAllResources,
    getSuggestResources
}



