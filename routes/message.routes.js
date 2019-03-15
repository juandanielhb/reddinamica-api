'use strict'

var express = require('express');
var messageController = require('../controllers/message.controller');

var authMiddleware = require('../middlewares/auth.middleware');

var api = express.Router();

api.get('/probando-msg', authMiddleware.ensureAuth, messageController.probando);

api.post('/message', authMiddleware.ensureAuth, messageController.saveMessage);
api.get('/my-messages/:page?', authMiddleware.ensureAuth, messageController.getReceiveMessages);
api.get('/messages/:page?', authMiddleware.ensureAuth, messageController.getEmittedMessages);
api.get('/unviewed-messages', authMiddleware.ensureAuth, messageController.getUnviewedMessages);
api.get('/setViewed-messages', authMiddleware.ensureAuth, messageController.setViewedMessage);

module.exports = api;