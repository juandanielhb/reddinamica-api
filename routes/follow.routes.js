'use strict'

let express = require('express');
let api = express.Router();

let auth = require('../middlewares/auth.middleware');
//let controlAccess = require('../middlewares/controlAccess.middleware');

let followController = require('../controllers/follow.controller');

api.post('/follow', auth.ensureAuth, followController.saveFollow);
api.delete('/follow', auth.ensureAuth, followController.deleteFollow);
api.get('/following/:id?/:page?', auth.ensureAuth, followController.getFollowingUsers);
api.get('/followers/:id?/:page?', auth.ensureAuth, followController.getFollowersUsers);
api.get('/my-follows/:followed?', auth.ensureAuth, followController.getMyFollows);

module.exports = api;