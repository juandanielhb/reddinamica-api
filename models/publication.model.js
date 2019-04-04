'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var publicationSchema = schema({
    text:String,
    user:{type: schema.ObjectId, ref: 'User'},
    created_at:String,
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    file:String
});

module.exports = mongoose.model('Publication', publicationSchema);