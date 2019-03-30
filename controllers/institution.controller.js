'use strict'
let { ITEMS_PER_PAGE } = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');

// Load models
let Institution = require('../models/institution.model');


function saveInstitution(req, res) {
    let params = req.body;

    let institution = new Institution();

    institution.name = params.name;
    institution.email = params.email;
    institution.website = params.website;
    institution.telephone = params.telephone;
    institution.city = params.city; 


    institution.save((err, institutionStored) => {
        if (err) return res.status(500).send({ message: 'The institution can not be saved' });

        if (!institutionStored) return res.status(404).send({ message: 'The institution has not been saved' });

        return res.status(200).send({ institution: institutionStored });
    });

}

function updateInstitution(req, res) {
    var institutionId = req.params.id;
    var updateData = req.body;

    Institution.findByIdAndUpdate(institutionId, updateData, { new: true }, (err, institutionUpdated) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The institution can not be updated' });

        if (!institutionUpdated) return res.status(404).send({ message: 'The institution has not been updated' });

        return res.status(200).send({ institution: institutionUpdated });
    });
}

function deleteInstitution(req, res) {
    var institutionId = req.params.id;

    Institution.findOneAndRemove({ _id: institutionId, used: "false" }, (err, institutionRemoved) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The institution can not be removed' });

        if (!institutionRemoved) return res.status(404).send({ message: 'The institution can not be removed, it has already been used or it has not been found' });

        return res.status(200).send({ institution: institutionRemoved });
    });
}

function getInstitutions(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = ITEMS_PER_PAGE;

    Institution.find().sort('name').populate('city').paginate(page, itemsPerPage, (err, institutions, total) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The institutions were not found' });

        if (!institutions) return res.status(404).send({ message: 'No institutions were found' });

        return res.status(200).send({
            institutions: institutions,
            total: total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });



}

function getAllInstitutions(req, res) {

    Institution.find().sort('name').populate('city').exec((err, institutions) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The institutions were not found' });

        if (!institutions) return res.status(404).send({ message: 'No institutions were found' });

        return res.status(200).send({institutions: institutions});
    });
}

module.exports = {
    saveInstitution,
    updateInstitution,
    deleteInstitution,
    getInstitutions,
    getAllInstitutions
}