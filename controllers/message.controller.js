'use strict'
let {ITEMS_PER_PAGE} = require('../config');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');
let fs = require('fs');

// Load models
let User = require('../models/user.model');
let Follow = require('../models/follow.model');
let Message = require('../models/message.model');

function saveMessage(req, res){
    let params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Send the required data'});

    let message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'Error in the request. The message cannot be saved.'});

        if(!messageStored) return res.status(404).send({message: 'The message has not saved'});

        return res.status(200).send({message: messageStored});
    });
}

function getReceiveMessages(req, res){
    let userId = req.user.sub;

    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    Message.find({receiver: userId}).populate('emitter', 'name surname picture _id').paginate(page, ITEMS_PER_PAGE, (err, messages, total) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The message cannot be obtained.'});

        if(!messages) return res.status(404).send({message: 'There are no messages'});

        
        return res.status(200).send({
            total,
            pages: Math.ceil(total/ITEMS_PER_PAGE),
            messages: messages
        });
    });
}

function getEmittedMessages(req, res){
    let userId = req.user.sub;

    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    Message.find({emitter: userId}).populate('emitter receiver', 'name surname picture _id').paginate(page, ITEMS_PER_PAGE, (err, messages, total) =>{
        if(err) return res.status(500).send({message: 'Error in the request. The message cannot be obtained.'});

        if(!messages) return res.status(404).send({message: 'There are no messages'});
        
        return res.status(200).send({
            total,
            pages: Math.ceil(total/ITEMS_PER_PAGE),
            messages: messages
        });
    });
}

function getUnviewedMessages(req, res){
    let userId = req.user.sub;

    Message.count({receiver:userId, viewed:'false'}, (err, count) => {
        if(err) return res.status(500).send({message: 'Error in the request. The count can not be made'});

        return res.status(200).send({
            'unviewed': count
        });        
    });
}

function setViewedMessage(req, res){
    let userId = req.user.sub;

    Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {multi:'true'}, (err, messagesUpdated) => {
        if(err) return res.status(500).send({message: 'Error in the request. The message can not be updated'});

        return res.status(200).send({
            messagesUpdated
        });    
    });
}


module.exports = {
    saveMessage,
    getReceiveMessages,
    getEmittedMessages,
    getUnviewedMessages,
    setViewedMessage
};