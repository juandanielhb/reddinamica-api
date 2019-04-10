'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');

var commentController = require('../controllers/comment.controller');

api.post('/comment', auth.ensureAuth, commentController.saveComment);
api.put('/comment/:id', auth.ensureAuth, commentController.updateComment);
api.delete('/comment/:id', auth.ensureAuth, commentController.deleteComment);


module.exports = api;
