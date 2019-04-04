'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');

var institutionController = require('../controllers/institution.controller');
var load = require('../resources/loadData')


api.post('/institution', institutionController.saveInstitution);
api.put('/institution/:id', [auth.ensureAuth, controlAccess.isAdmin], institutionController.updateInstitution);
api.delete('/institution/:id', [auth.ensureAuth, controlAccess.isAdmin], institutionController.deleteInstitution);
api.get('/institutions/:page?', institutionController.getInstitutions);
api.get('/all-institutions', institutionController.getAllInstitutions);

//Cargar datos
api.post('/saveee', load.save);

module.exports = api;
