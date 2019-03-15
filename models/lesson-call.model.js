'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    title:String,
    resume:String,
    references:String,
    knowledge_area:[String],
    grade:[String],
    amount:Number,
    endorsement:String,
    author:{type: schema.ObjectId, ref: 'User'},
    reviewed_by:{type: schema.ObjectId, ref: 'User'},
    interested:[{type: schema.ObjectId, ref:'User'}],
    created_at:String,
    published_at:String
});

module.exports = mongoose.model('Lesson-call', userSchema);