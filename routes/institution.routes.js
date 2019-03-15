'use strict'

var express = require('express');
var institutionController = require('../controllers/institution.controller');

var api = express.Router();
var authMiddleware = require('../middlewares/auth.middleware');



api.post('/institution', institutionController.saveInstitution);
api.put('/institution/:id', institutionController.updateInstitution);
api.delete('/institution/:id', institutionController.deleteInstitution);
api.get('/institutions/:page?', institutionController.getInstitutions);



// api.post('/register', userController.saveUser);
// api.post('/login', userController.login);
// api.get('/user/:id', authMiddleware.ensureAuth , userController.getUser);
// api.get('/users/:page?', authMiddleware.ensureAuth , userController.getUsers);
// api.get('/counters/:id?', authMiddleware.ensureAuth , userController.getCounters);
// api.put('/update-user/:id', authMiddleware.ensureAuth , userController.updateUser);
// api.post('/upload-image-user/:id', [authMiddleware.ensureAuth, uploadMiddleware] , userController.uploadProfilePic);
// api.get('/get-image-user/:imageFile', userController.getProfilePic);

module.exports = api;