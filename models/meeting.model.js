'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    commentary:String,
    files:[String],
    lesson:{type:schema.ObjectId, ref:'Lesson'},
    date:String
});

module.exports = mongoose.model('Meeting', userSchema);