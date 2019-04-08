'use strict'

let express = require('express');
let api = express.Router();

let auth = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');
//let controlAccess = require('../middlewares/controlAccess.middleware');

let publicationController = require('../controllers/publication.controller');

const POST_PATH = '../uploads/posts/';


api.post('/publication', auth.ensureAuth, publicationController.savePublication);
api.delete('/publication/:id', auth.ensureAuth, publicationController.deletePublication);
api.get('/publications/:page?', auth.ensureAuth, publicationController.getPublications);
api.get('/user-publications/:id/:page?', auth.ensureAuth, publicationController.getUserPublications);
api.get('/publication/:id', auth.ensureAuth, publicationController.getPublication);
api.post('/upload-file-post/:id', [auth.ensureAuth, uploadMiddleware.uploadImage(POST_PATH)],publicationController.uploadPublicationFile);
api.get('/get-image-post/:file', publicationController.getPublicacionFile);

module.exports = api;
