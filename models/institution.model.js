'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    website:String,
    level:[String],
    email:String,
    telephone:String,    
    used:{type:String, default:"false"},
    city:{type: schema.ObjectId, ref: 'City'}
});

module.exports = mongoose.model('Institution', userSchema);