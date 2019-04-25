'use strict'

let mongoose = require('mongoose');
let schema = mongoose.Schema;

let call = schema({
    text:String,
    visible:{type:Boolean, default: false},
    author:{type: schema.ObjectId, ref: 'User'},
    interested:[{type: schema.ObjectId, ref:'User'}]
});

let file = schema({
    originalName:String,
    mimetype:String,
    size:Number,
    fileName:String,
    groupTitle:String,
    created_at:String    
});

let message = schema({
    text:String,
    author:{type: schema.ObjectId, ref: 'User'},
    file:file,
    conversationTitle:String,    
    created_at:String    
});

let lessonSchema = schema({
    title:String,
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
    visible:{type:Boolean, default: false},
    accepted:{type:Boolean, default: false},
    knowledge_area:[{type: schema.ObjectId, ref: 'Knowledge-area'},],    
    views:{type: Number, default:0},
    score:{type: Number, default:0},
    conversations:[message],
    expert_comments:[message],
    comments:[{type: schema.ObjectId, ref: 'Comment'}],
    files:[file], 
    father_lesson:{type: schema.ObjectId, ref: 'Lesson'},
    son_lesson:{type: schema.ObjectId, ref: 'Lesson'},
    version:{type: Number, default:1}
});

module.exports = mongoose.model('Lesson', lessonSchema);