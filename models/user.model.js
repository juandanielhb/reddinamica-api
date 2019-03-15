'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    surname:String,
    password:String,
    email:{type:String,unique:true},
    about:String,
    gender:String,
    state:String,
    is_actived:Boolean,
    role:String,
    postgraduate:String,
    picture:String,
    knowledge_area:[String],
    profession:[String],
    institution: {type: schema.ObjectId, ref: 'Institution'},
    city: {type: schema.ObjectId, ref: 'City'},
    created_at:String
});

module.exports = mongoose.model('User', userSchema);