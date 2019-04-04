'use strict'

let express = require('express');
let api = express.Router();

let auth = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');
//let controlAccess = require('../middlewares/controlAccess.middleware');

let publicationController = require('../controllers/publication.controller');

const POST_PATH = '../uploads/posts/';


api.post('/publication', auth.ensureAuth, publicationController.savePublication);
api.get('/publications/:page?', auth.ensureAuth, publicationController.getPublications);
api.get('/publication/:id', auth.ensureAuth, publicationController.getPublication);
api.delete('/publication/:id', auth.ensureAuth, publicationController.deletePublication);
api.post('/upload-file-post/:id', [auth.ensureAuth, uploadMiddleware.uploadImage(POST_PATH)],publicationController.uploadPublicationFile);
// api.get('/upload-file-pub/:file', [auth.ensureAuth, uploadMiddleware.uploadImage(POST_PATH)],publicationController.getPublicacionFile);



module.exports = api;

module.exports = api;