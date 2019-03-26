'use strict'

// Libraries
let express = require('express');
let userController = require('../controllers/user.controller');

// Middleware
let authMiddleware = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');

let api = express.Router();

const USERS_PATH = '../uploads/users/';

api.post('/register', userController.saveUser);
api.post('/login', userController.login);
api.put('/user-update/:id', authMiddleware.ensureAuth, userController.updateUser);

// api.get('/user/:id', authMiddleware.ensureAuth , userController.getUser);
// api.get('/users/:page?', authMiddleware.ensureAuth , userController.getUsers);

api.post('/upload-image-user/:id', [authMiddleware.ensureAuth, uploadMiddleware.uploadImage(USERS_PATH)] , userController.uploadProfilePic);
api.get('/get-image-user/:imageFile', userController.getProfilePic);


module.exports = api;