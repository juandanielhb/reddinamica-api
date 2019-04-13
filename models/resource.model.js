'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var resourceSchema = schema({
    name:String,
    type:String,
    source:String,
    description:String,
    visible:{type:Boolean, default: false},
    downloads:{type:Number, default: 0},
    score:{type: Number, default: 0},
    justification:String,
    accepted:{type:Boolean, default: false},
    author:{type:schema.ObjectId, ref:'User'},
    url:String,
    file:String,
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    created_at:String
});

module.exports = mongoose.model('Resource', resourceSchema);