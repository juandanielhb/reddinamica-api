'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');

var knowledgeAreaController = require('../controllers/knowledgeArea.controller');


api.post('/area', auth.ensureAuth, knowledgeAreaController.saveArea);
api.put('/area/:id', [auth.ensureAuth, controlAccess.isAdmin],knowledgeAreaController.updateArea);
api.delete('/area/:id', [auth.ensureAuth, controlAccess.isAdmin], knowledgeAreaController.deleteArea);
api.get('/areas/:page?', auth.ensureAuth, knowledgeAreaController.getAreas);
api.get('/all-areas', auth.ensureAuth, knowledgeAreaController.getAllAreas);


module.exports = api;