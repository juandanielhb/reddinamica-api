'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var lessonCall = schema({
    text:String,
    visible:{type:Boolean, default: false},
    author:{type: schema.ObjectId, ref: 'User'},
    created_at:String,
    interested:[{type: schema.ObjectId, ref:'User'}]
});

module.exports = mongoose.model('Lesson-call', lessonCall);