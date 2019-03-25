'use strict'
let {ITEMS_PER_PAGE} = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');

// Load models
let KnowledgeArea = require('../models/knowledge-area.model');


function saveArea(req, res){
    let params = req.body;
    
    let knowledgeArea = new KnowledgeArea(); 
    
    knowledgeArea.name = params.name;
  
    knowledgeArea.save((err, areaStored) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The area can not be saved'});       
        
        if(!areaStored) return res.status(404).send({message: 'The area has not been saved'});

        return res.status(200).send({area: areaStored});
    });  
    
 }
 
 function updateArea(req, res){
    var areaId = req.params.id;
    var updateData = req.body;    

    KnowledgeArea.findByIdAndUpdate(areaId, updateData, {new:true}, (err, areaUpdated) => {
         if(err) return res.status(500).send({message: 'Error in the request. The area can not be updated'});
 
         if(!areaUpdated) return res.status(404).send({message: 'The area has not been updated'});
 
         return res.status(200).send({area: areaUpdated});
     });
 }

 function getAreas(req, res){
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    KnowledgeArea.find().sort('name').paginate(page, ITEMS_PER_PAGE, (err, areas, total) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The areas were not found'});

        if(!areas) return res.status(404).send({message: 'No areas were found'});

        return res.status(200).send({
                areas: areas,               
                total: total,
                pages: Math.ceil(total/ITEMS_PER_PAGE)                
            });
        });
 }

 function deleteArea(req, res){
    var areaId = req.params.id;    

    KnowledgeArea.findOneAndRemove({_id: areaId, used:"false"},(err,areaRemoved) => {
        console.log(err);
        if(err) return res.status(500).send({message:'Error in the request. The Area can not be removed '});

        if(!areaRemoved) return res.status(404).send({message: 'The Area can not be removed, it has already been used or it has not been found'});        
        
        return res.status(200).send({area: areaRemoved});
    });       
 }


 module.exports = {
    saveArea,
    deleteArea,
    updateArea,
    getAreas
}



