'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');

var api = express.Router();
var authMiddleware = require('../middlewares/auth.middleware');
var multipart = require('connect-multiparty');

var uploadMiddleware = multipart({uploadDir:'./uploads/users'});


// api.get('/home', userController.home);
// api.get('/pruebas', authMiddleware.ensureAuth , userController.pruebas);
// api.post('/register', userController.saveUser);
// api.post('/login', userController.login);
// api.get('/user/:id', authMiddleware.ensureAuth , userController.getUser);
// api.get('/users/:page?', authMiddleware.ensureAuth , userController.getUsers);
// api.get('/counters/:id?', authMiddleware.ensureAuth , userController.getCounters);
// api.put('/update-user/:id', authMiddleware.ensureAuth , userController.updateUser);
// api.post('/upload-image-user/:id', [authMiddleware.ensureAuth, uploadMiddleware] , userController.uploadProfilePic);
// api.get('/get-image-user/:imageFile', userController.getProfilePic);

module.exports = api;