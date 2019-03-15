'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    user:{type:schema.ObjectId, ref:'User'},
    date:String,
    ip:String
});

module.exports = mongoose.model('Login-log', userSchema);