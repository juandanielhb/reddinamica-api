'use strict'

var express = require('express');
var api = express.Router();

var authMiddleware = require('../middlewares/auth.middleware');

var followController = require('../controllers/follow.controller');


api.post('/follow', authMiddleware.ensureAuth, followController.saveFollow);
api.delete('/follow/:id', authMiddleware.ensureAuth, followController.unfollow);
api.get('/following/:id?/:page?', authMiddleware.ensureAuth, followController.getFollowing);
api.get('/followers/:id?/:page?', authMiddleware.ensureAuth, followController.getFollowers);
api.get('/follows/:followed?', authMiddleware.ensureAuth, followController.getMyFollows);

module.exports = api;