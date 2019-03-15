'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String
});

module.exports = mongoose.model('Profession', userSchema);