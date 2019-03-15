'use strict'

// Load libraries
// var path = require('path');
// var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

// Load models
var UserModel = require('../models/user.model');
var FollowModel = require('../models/follow.model');

function saveFollow(req, res){
   var params = req.body;

   var follow = new FollowModel(); 

   follow.user = req.user.sub;
   follow.followed = params.followed;

   follow.save((err, followStored) =>{
       if(err) return res.status(500).send({message: 'Error al guardar el follow'});

       if(!followStored) return res.status(404).send({message: 'El follow no se ha guardado'});

       return res.status(200).send({follow: followStored});
   });


}

function unfollow(req, res){
    var userId = req.user.sub;
    var followId = req.params.id;

    FollowModel.find({'user':userId, 'followed': followId}).remove((err) =>
    {
        if(err) return res.status(500).send({message:'Error al dejar de seguir'});

        return res.status(200).send({message: 'El follow se ha eliminado!!'}); 
    });
    
}

function getFollowing(req, res){
    var userId = req.user.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var itemsPerPage = 2;

    FollowModel.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message:'Error el servidor'});

        if(!follows) return res.status(404).send({message:'No estas siguiendo a ningún usuario'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    });


}

function getFollowers(req, res){
    var userId = req.user.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var itemsPerPage = 2;

    FollowModel.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message:'Error el servidor'});

        if(!follows) return res.status(404).send({message:'No te sigue ningún usuario'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    });


}

function getMyFollows(req, res){
    var userId = req.user.sub;

    var find = FollowModel.find({user: userId});

    if(req.params.followed){
        find = FollowModel.find({followed: userId});
    }

    find.populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message:'Error el servidor'});

        if(!follows) return res.status(404).send({message:'No estas siguiendo a ningún usuario'});

        return res.status(200).send({follows});
    });
}

function getFollowersNoPage(req, res){
    var userId = req.user.sub;

    FollowModel.find({followed: userId}).populate('user followed').exec((err, follows) => {
        if(err) return res.status(500).send({message:'Error el servidor'});

        if(!follows) return res.status(404).send({message:'No te sigue ningún usuario'});

        return res.status(200).send({follows});
    });
}

module.exports = {
    saveFollow,
    unfollow,
    getFollowing,
    getFollowers,
    getMyFollows
};



