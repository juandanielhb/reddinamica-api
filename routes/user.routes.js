'use strict'

let express = require('express');
let userController = require('../controllers/user.controller');


let api = express.Router();

let authMiddleware = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');

api.post('/register', userController.saveUser);
api.post('/login', userController.login);
api.post('/upload', uploadMiddleware, (req,res) => {
     console.log(req.file);
     res.send('upload');
 });


// api.get('/home', userController.home);
// api.get('/pruebas', authMiddleware.ensureAuth , userController.pruebas);

// api.get('/user/:id', authMiddleware.ensureAuth , userController.getUser);
// api.get('/users/:page?', authMiddleware.ensureAuth , userController.getUsers);
// api.get('/counters/:id?', authMiddleware.ensureAuth , userController.getCounters);
// api.put('/update-user/:id', authMiddleware.ensureAuth , userController.updateUser);
// api.post('/upload-image-user/:id', [authMiddleware.ensureAuth, uploadMiddleware] , userController.uploadProfilePic);
// api.get('/get-image-user/:imageFile', userController.getProfilePic);

module.exports = api;