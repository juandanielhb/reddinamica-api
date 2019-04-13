'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');

var resourceController = require('../controllers/resource.controller');

const RESOURCE_PATH = '../uploads/resources/';

api.post('/resource', auth.ensureAuth, resourceController.saveResource);
api.post('/upload-resource/:id', [auth.ensureAuth, uploadMiddleware.uploadFile(RESOURCE_PATH)],resourceController.uploadResourceFile);
api.get('/get-resource/:file', resourceController.getResourceFile);
// api.put('/city/:id', [auth.ensureAuth, controlAccess.isAdmin], resourceController.updateCity);
// api.delete('/city/:id', [auth.ensureAuth, controlAccess.isAdmin], resourceController.deletecity);
// api.get('/cities/:page?',auth.ensureAuth, resourceController.getCities);
// api.get('/all-cities', auth.ensureAuth, resourceController.getAllCities);

module.exports = api;