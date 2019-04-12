'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var resourceSchema = schema({
    name:String,
    type:String,
    source:String,
    description:String,
    visible:Boolean,
    downloads:Number,
    score:{type: Number, default:0},
    justification:String,
    author:{type:schema.ObjectId, ref:'User'},
    url:String,
    files:[String],
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    created_at:String
});

module.exports = mongoose.model('Resource', resourceSchema);