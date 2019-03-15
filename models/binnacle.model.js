'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    created_at:String,
    user:{type: schema.ObjectId, ref:'User'},
    description:String,
    file:[String],
    lesson:{type:schema.ObjectId, ref:'Lesson'}
});

module.exports = mongoose.model('Binnacle', userSchema);