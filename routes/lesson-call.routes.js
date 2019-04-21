'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');

var callController = require('../controllers/lesson-call.controller');

api.post('/call', [auth.ensureAuth, controlAccess.isAdmin], callController.saveCall);
api.put('/call/:id', auth.ensureAuth, callController.updateCall);
api.delete('/call/:id', [auth.ensureAuth, controlAccess.isAdmin], callController.deleteCall);
api.get('/calls/:visibleOnes/:page?', auth.ensureAuth, callController.getCalls);
api.get('/all-calls/:visibleOnes', auth.ensureAuth, callController.getAllCalls);

module.exports = api;
