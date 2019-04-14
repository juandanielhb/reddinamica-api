'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var lessonCall = schema({
    title:String,
    resume:String,
    references:String,
    knowledge_area:[String],
    grade:[String],
    amount:Number,
    author:{type: schema.ObjectId, ref: 'User'},
    published_by:{type: schema.ObjectId, ref: 'User'},
    interested:[{type: schema.ObjectId, ref:'User'}],
    lesson:[{type: schema.ObjectId, ref:'Lesson'}],
    created_at:String,
    published_at:String
});

module.exports = mongoose.model('Lesson-call', lessonCall);