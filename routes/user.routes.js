'use strict'

// Libraries
let express = require('express');
let userController = require('../controllers/user.controller');

// Middleware
let auth = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');

let api = express.Router();

const USERS_PATH = '../uploads/users/';

api.post('/register', userController.saveUser);
api.post('/registerbyAdmin', [auth.ensureAuth, controlAccess.isAdmin],  userController.saveUserByAdmin);
api.post('/login', userController.login);
api.post('/validate-password', auth.ensureAuth, userController.validatePassword);
api.post('/change-password', auth.ensureAuth, userController.changePassword);

api.put('/user-update/:id', auth.ensureAuth, userController.updateUser);
api.delete('/user/:id', [auth.ensureAuth, controlAccess.isAdmin], userController.deleteUser);
api.delete('/user', auth.ensureAuth, userController.deleteUser);
api.get('/user/:id', auth.ensureAuth , userController.getUser);
api.get('/users/:page?', auth.ensureAuth , userController.getUsers);
api.get('/all-users', auth.ensureAuth , userController.getAllUsers);
api.get('/new-users/:page?', [auth.ensureAuth, controlAccess.isAdmin], userController.getNewUsers);
api.get('/counters/:id?', auth.ensureAuth , userController.getCounters);

api.post('/upload-image-user/:id', [auth.ensureAuth, uploadMiddleware.uploadImage(USERS_PATH)] , userController.uploadProfilePic);
api.get('/get-image-user/:imageFile', userController.getProfilePic);


api.post('/prueba', userController.prueba);


module.exports = api;