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

api.put('/resource/:id', auth.ensureAuth, resourceController.updateResource);

api.delete('/resource/:id', [auth.ensureAuth, controlAccess.isAdmin], resourceController.deleteResource);

api.get('/resources/:visibleOnes/:page?', auth.ensureAuth, resourceController.getResources);
api.get('/all-resources/:visibleOnes/:order?', auth.ensureAuth, resourceController.getAllResources);

api.get('/suggest-resources/:page?', auth.ensureAuth, resourceController.getSuggestResources);


module.exports = api;