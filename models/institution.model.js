'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    email:String,
    website:String,
    telephone:String,
    city: {type: schema.ObjectId, ref: 'City'},
    used:{type:Boolean, default: false}
});

module.exports = mongoose.model('Institution', userSchema);