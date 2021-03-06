'use strict'
let {ITEMS_PER_PAGE} = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');

// Load models
let City = require('../models/city.model');


function saveCity(req, res){
    let params = req.body;
    
    let city = new City(); 
    
    city.name = params.name;
    city.state = params.state;
    city.country = params.country;
    city.used = params.used;
  
    city.save((err, cityStored) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The city can not be saved'});       
        
        if(!cityStored) return res.status(404).send({message: 'The city has not been saved'});

        return res.status(200).send({city: cityStored});
    });  
    
 }
 
 function updateCity(req, res){
    var cityId = req.params.id;
    var updateData = req.body;
    

    City.findByIdAndUpdate(cityId, updateData, {new:true}, (err, cityUpdated) => {
         if(err) return res.status(500).send({message: 'Error in the request. The city can not be updated'});
 
         if(!cityUpdated) return res.status(404).send({message: 'The city has not been updated'});
 
         return res.status(200).send({city: cityUpdated});
     });
 }

 function getCities(req, res){
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    City.find().sort('name').paginate(page, ITEMS_PER_PAGE, (err, cities, total) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The cities were not found'});

        if(!cities) return res.status(404).send({message: 'No cities were found'});

        return res.status(200).send({
                cities: cities,               
                total: total,
                pages: Math.ceil(total/ITEMS_PER_PAGE)                
            });
        });
 }

 function getAllCities(req, res){

    City.find().sort('name').exec((err, cities) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The cities were not found'});

        if(!cities) return res.status(404).send({message: 'No cities were found'});

        return res.status(200).send({cities: cities});

    });
 }

 function deletecity(req, res){
    var cityId = req.params.id;    

    City.findOneAndRemove({_id: cityId},(err,cityRemoved) => {
        if(err) return res.status(500).send({message:'Error in the request. The city can not be removed '});

        if(!cityRemoved) return res.status(404).send({message: 'The city can not be removed, it has already been used or it has not been found'});        
        
        return res.status(200).send({city: cityRemoved});
    });       
 }


 module.exports = {
    saveCity,
    updateCity,
    deletecity,
    getCities,
    getAllCities
}



