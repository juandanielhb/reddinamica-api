'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var messageSchema = schema({    
    emitter:{type: schema.ObjectId, ref: 'User'},
    receiver:{type: schema.ObjectId, ref: 'User'},
    viewed:Boolean,
    text:String,
    created_at:String
});

module.exports = mongoose.model('Message', messageSchema);