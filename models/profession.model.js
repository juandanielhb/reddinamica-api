'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    used:{type:Boolean, default: false}
});

module.exports = mongoose.model('Profession', userSchema);