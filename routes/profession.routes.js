'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');

var professionController = require('../controllers/profession.controller');


api.post('/profession', professionController.saveProfession);
api.put('/profession/:id', [auth.ensureAuth, controlAccess.isAdmin], professionController.updateProfession);
api.delete('/profession/:id', [auth.ensureAuth, controlAccess.isAdmin], professionController.deleteProfession);
api.get('/professions/:page?', professionController.getProfessions);
api.get('/all-professions', professionController.getAllProfessions);


module.exports = api;