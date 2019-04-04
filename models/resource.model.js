'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var resourceSchema = schema({
    name:String,
    type:String,
    source:String,
    description:String,
    visible:Boolean,
    views:Number,
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    author:{type:schema.ObjectId, ref:'User'},
    files:[String],
    created_at:String
});

module.exports = mongoose.model('Resource', resourceSchema);