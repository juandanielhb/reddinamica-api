'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    views:Number,
    name:String,
    type:String,
    source:String,
    description:String,
    visible:String,
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    author:{type:schema.ObjectId, ref:'User'},
    created_at:String
});

module.exports = mongoose.model('Resource', userSchema);