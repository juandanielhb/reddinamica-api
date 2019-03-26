'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    surname:String,
    password:String,
    email:{type:String,unique:true},
    about:String,
    role:String,
    actived:{type:Boolean, default:false},
    postgraduate:String,
    picture: {type:String, default:'user-default.png'},
    knowledge_area:[String],
    profession:{type: schema.ObjectId, ref: 'Profession'},
    institution: {type: schema.ObjectId, ref: 'Institution'},
    city: {type: schema.ObjectId, ref: 'City'},
    visits:{type:Number, default:0},
    created_at:String
});

module.exports = mongoose.model('User', userSchema);