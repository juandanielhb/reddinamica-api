'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    created_at:String,
    user:{type: schema.ObjectId, ref:'User'},
    comment:String,
    rating:Number
});

module.exports = mongoose.model('Comment', userSchema);