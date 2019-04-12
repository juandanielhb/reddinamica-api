'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var entrySchema = schema({
    created_at:String,
    user:{type: schema.ObjectId, ref:'User'},
    description:String,
    url:[String]    
});

module.exports = mongoose.model('Entry', entrySchema);