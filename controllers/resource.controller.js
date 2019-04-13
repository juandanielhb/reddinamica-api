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
    //resource.file = params.file;
    resource.link = params.link;

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

// function updateCity(req, res) {
//     var cityId = req.params.id;
//     var updateData = req.body;


//     City.findByIdAndUpdate(cityId, updateData, { new: true }, (err, cityUpdated) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The city can not be updated' });

//         if (!cityUpdated) return res.status(404).send({ message: 'The city has not been updated' });

//         return res.status(200).send({ city: cityUpdated });
//     });
// }

// function getCities(req, res) {
//     var page = 1;

//     if (req.params.page) {
//         page = req.params.page;
//     }

//     City.find().sort('name').paginate(page, ITEMS_PER_PAGE, (err, cities, total) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The cities were not found' });

//         if (!cities) return res.status(404).send({ message: 'No cities were found' });

//         return res.status(200).send({
//             cities: cities,
//             total: total,
//             pages: Math.ceil(total / ITEMS_PER_PAGE)
//         });
//     });
// }

// function getAllCities(req, res) {

//     City.find().sort('name').exec((err, cities) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The cities were not found' });

//         if (!cities) return res.status(404).send({ message: 'No cities were found' });

//         return res.status(200).send({ cities: cities });

//     });
// }

// function deletecity(req, res) {
//     var cityId = req.params.id;

//     City.findOneAndRemove({ _id: cityId, used: "false" }, (err, cityRemoved) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The city can not be removed ' });

//         if (!cityRemoved) return res.status(404).send({ message: 'The city can not be removed, it has already been used or it has not been found' });

//         return res.status(200).send({ city: cityRemoved });
//     });
// }

async function removeFilesOfUpdates(res, httpCode, filePath, message) {
    await fs.unlink(filePath, (err) => {
        return res.status(httpCode).send({ message: message })
    });
}

module.exports = {
    saveResource,
    uploadResourceFile,
    getResourceFile,
    deleteResource
}



