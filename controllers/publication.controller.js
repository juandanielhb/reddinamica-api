'use strict'

// Libraries
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

// Models
var PublicationModel = require('../models/publication.model');
var UserModel = require('../models/user.model');
var FollowModel = require('../models/follow.model');

// Test
function probando(req, res){
    return res.status(200).send({message:'Probando desde el controlador de Publicaciones'});
}

function savePublication(req, res){
    var params = req.body;  
    
    var publication = new PublicationModel();

    if(!params.text){
        return res.status(200).send({message: 'Debes enviar un texto'});
    }
    
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    
    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message:'Error al guardar la publicación'});

        if(!publicationStored) return res.status(404).send({message:'La publicación no ha sido guardada.'});

        return res.status(200).send({publication: publicationStored});

    });


}

function getPublications(req, res){
    var page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    FollowModel.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message:'Error devolver los usuarios que el usuario esta siguiendo'});

        var followsClean = [];

        follows.forEach((follow)=>{
            followsClean.push(follow.followed);
        });
        
        PublicationModel.find({user: {"$in": followsClean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            
            if(err) return res.status(500).send({message:'Error al devolver publicaciones'});

            if(!publications) return res.status(404).send({message:'No hay publicaciones'});

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                publications
            });
        });
    });



}

function getPublication(req, res){
    var publicationId = req.params.id;

    PublicationModel.findById(publicationId, (err, publication) =>{
        if(err) return res.status(500).send({message:'Error devolver la publicación'});

        if(!publication) return res.status(404).send({message:'No existe la publicación'});

        return res.status(200).send({publication});
    });
}

function deletePublication(req, res){
    var publicationId = req.params.id;

    PublicationModel.find({user: req.user.sub, '_id': publicationId}).remove((err) => {
        if(err) return res.status(500).send({message:'Error al borrar la publicación'});

        // if(!publicationRemoved) return res.status(404).send({message:'No se ha borrado la publicación'});

        return res.status(200).send({message: 'La publicación se ha borrado'});
    });
}

// Upload publication file
function uploadPublicationFile(req, res){
    var publicationId = req.params.id;
 
    if(req.files){
        var filePath = req.files.image.path;
        
        var fileSplit = filePath.split('\\');
        
        var fileName = fileSplit[2];
        
        var extSplit = fileName.split('\.');

        var ext = extSplit[1].toLowerCase();
        
        if( ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif'){
            
            PublicationModel.findOne({user: req.user.sub, '_id': publicationId}, (err, publication) => {
                console.log(publication);
                if(publication){
                    //return res.status(200).send(filePath);
                    PublicationModel.findByIdAndUpdate(publicationId, {file: fileName}, {new:true}, (err, publicationUpdated) =>{
                        // console.log(err);
                        if(err) return res.status(500).send({message: 'Error en la petición'});
                
                        if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                
                        return res.status(200).send(publicationUpdated);
                    });

                }else{
                    return removeFilesOfUpdates(res, filePath, 'No tienes permiso para actualizar la publicación');
                }
            });       

    }else{
        return res.status(200).send({message: 'No se han subido ningún archivo.'})
    }
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

function removeFilesOfUpdates(res, filePath, message){
    fs.unlink(filePath, (err) => {
        return res.status(200).send({message: message})
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadPublicationFile,
    getPublicacionFile
};