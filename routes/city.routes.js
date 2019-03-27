'use strict'

var express = require('express');
var api = express.Router();

var auth = require('../middlewares/auth.middleware');
var controlAccess = require('../middlewares/controlAccess.middleware');

var cityController = require('../controllers/city.controller');

api.post('/city', auth.ensureAuth, cityController.saveCity);
api.put('/city/:id', [auth.ensureAuth, controlAccess.isAdmin], cityController.updateCity);
api.delete('/city/:id', [auth.ensureAuth, controlAccess.isAdmin], cityController.deletecity);
api.get('/cities/:page?',auth.ensureAuth, cityController.getCities);
api.get('/all-cities', auth.ensureAuth, cityController.getAllCities);

module.exports = api;