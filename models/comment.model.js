'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    created_at:String,
    user:{type: schema.ObjectId, ref:'User'},
    text:String,
    rating:{type: Number, default:0}
});

module.exports = mongoose.model('Comment', userSchema);