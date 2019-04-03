'use strict'
let {ITEMS_PER_PAGE} = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');

// Load models
let Profession = require('../models/profession.model');


function saveProfession(req, res){
    let params = req.body;
    
    let profession = new Profession(); 
    
    profession.name = params.name;
    profession.used = params.used;
  
    profession.save((err, professionStored) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The profession can not be saved'});       
        
        if(!professionStored) return res.status(404).send({message: 'The profession has not been saved'});

        return res.status(200).send({profession: professionStored});
    });  
    
 }
 
 function updateProfession(req, res){
    var professionId = req.params.id;
    var updateData = req.body;    

    Profession.findByIdAndUpdate(professionId, updateData, {new:true}, (err, professionUpdated) => {
         if(err) return res.status(500).send({message: 'Error in the request. The profession can not be updated'});
 
         if(!professionUpdated) return res.status(404).send({message: 'The profession has not been updated'});
 
         return res.status(200).send({profession: professionUpdated});
     });
 }

 function getProfessions(req, res){
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    Profession.find().sort('name').paginate(page, ITEMS_PER_PAGE, (err, professions, total) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The professions were not found'});

        if(!professions) return res.status(404).send({message: 'No professions were found'});

        return res.status(200).send({
                professions: professions,               
                total: total,
                pages: Math.ceil(total/ITEMS_PER_PAGE)                
            });
        });
 }

 function getAllProfessions(req, res){

    Profession.find().sort('name').exec((err, professions)=>{
        if(err) return res.status(500).send({message: 'Error in the request. The professions were not found'});

        if(!professions) return res.status(404).send({message: 'No professions were found'});

        return res.status(200).send({ professions: professions});
        
        });
 }

 function deleteProfession(req, res){
    var professionId = req.params.id;    

    Profession.findOneAndRemove({_id: professionId, used:"false"},(err,professionRemoved) => {
        console.log(err);
        if(err) return res.status(500).send({message:'Error in the request. The profession can not be removed '});

        if(!professionRemoved) return res.status(404).send({message: 'The profession can not be removed, it has already been used or it has not been found'});        
        
        return res.status(200).send({profession: professionRemoved});
    });       
 }


 module.exports = {
    saveProfession,
    deleteProfession,
    updateProfession,
    getProfessions,
    getAllProfessions
}



