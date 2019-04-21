'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;


var call = schema({
    text:String,
    visible:{type:Boolean, default: false},
    author:{type: schema.ObjectId, ref: 'User'},
    interested:[{type: schema.ObjectId, ref:'User'}]
});


var lessonSchema = schema({
    title:String,
    objectives:[String],
    resume:String,
    references:String,
    justification:String,
    development_level:String,
    level:String,
    state:String,
    type:String,
    call:call,
    expert:{type: schema.ObjectId, ref: 'User'},
    author:{type: schema.ObjectId, ref: 'User'},
    leader:{type: schema.ObjectId, ref: 'User'},
    development_group:[{type: schema.ObjectId, ref: 'User'}],
    created_at:String,
    published_at:String,
    visible:{type:Boolean, default: false},
    accepted:{type:Boolean, default: false},
    knowledge_area:[{type: schema.ObjectId, ref: 'Knowledge-area'},],    
    views:{type: Number, default:0},
    score:{type: Number, default:0},
    entries:[{type: schema.ObjectId, ref: 'Entry'}],
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    files:[{type: schema.ObjectId, ref: 'File'}], //rEVISAR COMO PONERLO    
    father_lesson:{type: schema.ObjectId, ref: 'Lesson'},
    son_lesson:{type: schema.ObjectId, ref: 'Lesson'},
    version:{type: Number, default:1}
});

module.exports = mongoose.model('Lesson', lessonSchema);