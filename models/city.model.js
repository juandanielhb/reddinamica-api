'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    state:String,
    country:String
});

module.exports = mongoose.model('City', userSchema);