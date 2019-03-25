'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    title:String,
    picture:String,
    description:String,
    created_at:String,
    author:{type: schema.ObjectId, ref:'User'},
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    source:String
});

module.exports = mongoose.model('New', userSchema);