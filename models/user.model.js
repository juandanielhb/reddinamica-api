'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name:String,
    surname:String,
    password:String,
    email:String,
    about:String,
    state:String,
    role:String,
    postgraduate:String,
    image:String,
    profession: { type: schema.ObjectId, ref: 'profession'},
    institution: { type: schema.ObjectId, ref: 'institution'},
    city: { type: schema.ObjectId, ref: 'city'},
    created_at:String
});

module.exports = mongoose.model('user', userSchema);