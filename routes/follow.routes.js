'use strict'

var express = require('express');
var followController = require('../controllers/follow.controller');


var authMiddleware = require('../middlewares/auth.middleware');

var api = express.Router();

api.post('/follow', authMiddleware.ensureAuth, followController.saveFollow);
api.delete('/follow/:id', authMiddleware.ensureAuth, followController.unfollow);
api.get('/following/:id?/:page?', authMiddleware.ensureAuth, followController.getFollowing);
api.get('/followers/:id?/:page?', authMiddleware.ensureAuth, followController.getFollowers);
api.get('/follows/:followed?', authMiddleware.ensureAuth, followController.getMyFollows);

module.exports = api;