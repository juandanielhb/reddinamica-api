'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var lessonSchema = schema({
    title:String,
    resume:String,
    references:String,
    state:String,
    expert:{type: schema.ObjectId, ref: 'User'},
    leader:{type: schema.ObjectId, ref: 'User'},
    development_group:[{type: schema.ObjectId, ref: 'User'}],
    created_at:String,
    published_at:String,
    visible:Boolean,
    knowledge_area:[String],
    grade:[String],
    views:Number,
    score:{type: Number, default:0},
    entries:[{type: schema.ObjectId, ref: 'Entry'}],
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    files:[{type: schema.ObjectId, ref: 'File'}],
    earlier_version:{type: schema.ObjectId, ref: 'Lesson'},
    next_version:{type: schema.ObjectId, ref: 'Lesson'}
});

module.exports = mongoose.model('Lesson', lessonSchema);