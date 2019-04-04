'use strict'
let {ITEMS_PER_PAGE} = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');
let fs = require('fs');

// Load models
let Publication = require('../models/publication.model');
let User = require('../models/user.model');
let Follow = require('../models/follow.model');

function savePublication(req, res){
    var params = req.body;  
    
    var publication = new Publication();

    if(!params.text){
        return res.status(200).send({message: 'The text content is null'});
    }
    
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    
    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message:'Error in the request. The post can not be saved'});

        if(!publicationStored) return res.status(404).send({message:'The post can not be saved.'});

        return res.status(200).send({publication: publicationStored});
    });
}

function getPublications(req, res){
    var page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }

    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message:'Error in the request. It can not be get the followed users'});

        var followsClean = [];

        follows.forEach((follow)=>{
            followsClean.push(follow.followed);
        });
        
        Publication.find({user: {"$in": followsClean}}).sort('-created_at').populate('user').paginate(page, ITEMS_PER_PAGE, (err, publications, total) => {
            
            if(err) return res.status(500).send({message:'Error in the request. It can not be get the publications'});

            if(!publications) return res.status(404).send({message:'There are no publications'});

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/ITEMS_PER_PAGE),
                publications
            });
        });
    });
}

function getPublication(req, res){
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) =>{
        if(err) return res.status(500).send({message:'Error in the request. It can not be get the publication'});

        if(!publication) return res.status(404).send({message:'There are no publication'});

        return res.status(200).send({publication});
    });
}

function deletePublication(req, res){
    var publicationId = req.params.id;

    Publication.findByIdAndRemove({user: req.user.sub, '_id': publicationId}, (err,publicationRemoved) => {
        if(err) return res.status(500).send({message:'Error in the request. It can not be removed the publication'});

        if(!publicationRemoved) return res.status(404).send({message:'The publication has not been removed'});

        return res.status(200).send({publication: publicationRemoved});
    });
}

function uploadPublicationFile(req, res) {
    var publicationId = req.params.id;
    let filePath = req.file.path;
    let filename = req.file.filename;

    
    
    if (req.file) {

        Publication.findOne({user:req.user.sub, '_id':publicationId}, (err, publication) =>{

            if(publication){

                Publication.findByIdAndUpdate(publicationId, { file: filename }, { new: true }, (err, publicationUpdated) => {

                    if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The publication can not be upadated');
        
                    if (!publicationUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The publication has not been updated');
        
                    return res.status(200).send({ publication: publicationUpdated });
                });

            }else{
                return removeFilesOfUpdates(res, 403, filePath, 'You do not have permission to update user data');
            }
        });
    } else {
        return res.status(200).send({ message: 'No file has been uploaded' })
    }
}

function getPublicacionFile(req, res){
    var file = req.params.file;    
    var pathFile = './uploads/publications/'+ file;

    fs.exists(pathFile, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(pathFile));

        }else{
            res.status(200).send({message:'No existe la imagen'});
        }
    });
}

async function removeFilesOfUpdates(res, httpCode, filePath, message) {
    await fs.unlink(filePath, (err) => {
        return res.status(httpCode).send({ message: message })
    });
}

module.exports = {
    
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadPublicationFile,
    getPublicacionFile
};