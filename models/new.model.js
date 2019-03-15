'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    created_at:String,
    title:String,
    picture:String,
    description:String,
    author:{type: schema.ObjectId, ref:'User'},
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    rating:Number
});

module.exports = mongoose.model('New', userSchema);