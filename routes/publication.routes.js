'use strict'

var express = require('express');
var publicationController = require('../controllers/publication.controller');

var api = express.Router();
var authMiddleware = require('../middlewares/auth.middleware');
var multipart = require('connect-multiparty');

var uploadMiddleware = multipart({uploadDir:'./uploads/publications'});


api.get('/probando', authMiddleware.ensureAuth, publicationController.probando);
api.post('/publication', authMiddleware.ensureAuth, publicationController.savePublication);
api.get('/publications/:page?', authMiddleware.ensureAuth, publicationController.getPublications);
api.get('/publication/:id', authMiddleware.ensureAuth, publicationController.getPublication);
api.delete('/publication/:id', authMiddleware.ensureAuth, publicationController.deletePublication);
api.post('/upload-file-pub/:id', [authMiddleware.ensureAuth, uploadMiddleware],publicationController.uploadPublicationFile);
api.get('/upload-file-pub/:file', [authMiddleware.ensureAuth, uploadMiddleware],publicationController.getPublicacionFile);


module.exports = api;
