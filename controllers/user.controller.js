'use strict'

var bcrypt = require('bcrypt-nodejs');
var UserModel = require('../models/user.model');
var FollowModel = require('../models/follow.model');
var PublicationModel = require('../models/publication.model');

var jwt = require('../services/jwt.service');
var fs = require('fs');
var path = require('path');


/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function saveUser(req, res){
    var params = req.body;
    var user = new UserModel();

    if( params.name && params.surname &&
        params.nick && params.email &&
        params.password){

            user.name = params.name;
            user.surname = params.surname;
            user.nick = params.nick;
            user.email = params.email;
            user.role = 'ROLE_USER';
            user.image = null;

            // Check duplicate users
            UserModel.find({
                $or: [
                    {email: user.email.toLowerCase()},
                    {nick: user.nick.toLowerCase()}
                ]}).exec((err, users) => {
                    if(err) return res.status(500).send({
                        message: 'Error en la petición de usuarios'
                    });

                    if (users && users.length >=1){
                        return res.status(200).send({
                            message: 'El usuario que intenta registrar ya existe'
                        });
                    }else{

                        bcrypt.hash(params.password, null, null, (error, hash) => {
                            user.password = hash;
                            user.save((err, userStored)=>{
                                if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
            
                                if(userStored){
                                    res.status(200).send({user: userStored});               
                                }else{
                                    res.status(404).send({message: 'No se ha registrado el usuario'});
                                }
                            });
                        });
                    }
                });

        }else{
            res.status(200).send({
                message:'Envía todos los campos requeridos'
            });
        }
}

function login(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    UserModel.findOne({email: email}, (err, user) =>{
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(user){
            bcrypt.compare(password, user.password, (err, check) =>{
                if(check){
                    if(params.getToken){
                        // generate and return token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        // return user data
                        user.password = undefined;
                        return res.status(200).send({user: user});
                    }
                }else{
                    return res.status(404).send({message:'El usuario no se ha podido identificar!'});
                }
            });
        }else{
            return res.status(404).send({message:'El usuario no se ha podido identificar!!'});
        }


    })


}

function getUser(req, res){
    var userId = req.params.id;

    UserModel.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!user) return res.status(404).send({message: 'El usuario no existe'});

        console.log(req.user.sub + " " + userId);

        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user,
                value
            });

        });
  
       
    });
}

async function followThisUser(identityUserId, userId){

    var following = await FollowModel.findOne({"user":identityUserId, "followed":userId},(err, follow) => {
        if(err) return handleError(err);
        
        return follow;
    });    

    var follower = await FollowModel.findOne({"user":userId, "followed":identityUserId},(err, follow) => {
        if(err) return handleError(err);
        
        return follow;
    });
    
    return {
        following: following,
        follower: follower        
    }
}

function getUsers(req, res){
    var userIdLoggedIn = req.user.sub;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    UserModel.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) =>{
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

        followsUserId(userIdLoggedIn).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_followers: value.followers,
                total,
                pages: Math.ceil(total/itemsPerPage),
                
            });
        });

    });
}

async function followsUserId(userId){
    console.log(userId);
    var following = await FollowModel.find({user: userId},{'_id':0,'_v':0, 'user':0}, (err, follows)=>{
        return follows;
    });

    var following_clean = [];

    following.forEach((follow)=>{
        following_clean.push(follow.followed);
    });

    var followers = await FollowModel.find({followed: userId}, {'_id':0,'_v':0, 'followed':0}, (err, follows)=>{
        return follows;
    });  

    var followers_clean = [];

    followers.forEach((follow)=>{
        followers_clean.push(follow.user);
    });

    
    return {
        following: following_clean,
        followers: followers_clean
    };
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

     // Delete password property
    delete update.password;
    
    if(userId != req.user.sub){
        return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'});
    }
    
    UserModel.find({
        $or: [
            {email: update.email.toLowerCase()},
            {nick: update.nick.toLowerCase()}
        ]}).exec((err, users) =>{
            
            let user_isset = false;

            users.forEach((user)=>{
                if(user && user._id != userId) {
                    user_isset = true
                };
            });

            if(user_isset){
                return res.status(500).send({message: 'Los datos ya están en uso.'});
            }

            UserModel.findByIdAndUpdate(userId, update,{new:true}, (err, userUpdated) =>{
               // console.log(err);
                if(err) return res.status(500).send({message: 'Error en la petición'});
        
                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        
                return res.status(200).send({user: userUpdated});
            });

        });


}

// Upload profile photo
function uploadProfilePic(req, res){
    var userId = req.params.id;
 
    if(req.files){
        var filePath = req.files.image.path;
        
        var fileSplit = filePath.split('\\');
        
        var fileName = fileSplit[2];
        
        var extSplit = fileName.split('\.');

        var ext = extSplit[1].toLowerCase();

        console.log(filePath);
        console.log(userId + " " + req.user.sub );
        if(userId != req.user.sub){
            console.log(1010); 
            return removeFilesOfUpdates(res, filePath, 'No tienes permiso para actualizar los datos del usuario');
        }        
        
        if( ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif'){
            //return res.status(200).send(filePath);
            UserModel.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated) =>{
                // console.log(err);
                 if(err) return res.status(500).send({message: 'Error en la petición'});
         
                 if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
         
                 return res.status(200).send({user:userUpdated});
             });

        }else{
            return removeFilesOfUpdates(res, filePath, 'Extensión no válida');
        }

    }else{
        return res.status(200).send({message: 'No se han subido ningún archivo.'})
    }
}

function getProfilePic(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/'+ imageFile;

    fs.exists(pathFile, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(pathFile));

        }else{
            res.status(200).send({message:'No existe la imagen'});
        }
    });
}

function removeFilesOfUpdates(res, filePath, message){
    fs.unlink(filePath, (err) => {
        return res.status(200).send({message: message})
    });
}

function getCounters(req,res){
    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }
    
    getCountFollow(userId).then((value)=>{
        return res.status(200).send(value)    
    });

}

async function getCountFollow(userId){
    var following = await FollowModel.count({user:userId},(err, count) => {
        if(err) return handleError(err);

        return count;
    });

    var followed = await FollowModel.count({followed:userId}, (err, count) => {
        if(err) return handleError(err);

        return count;        
    });

    var publications = await PublicationModel.count({user:userId}, (err, count) => {
        if(err) return handleError(err);

        return count;        
    });
        
    return {
        followingNumber: following,
        followedNumber: followed,
        publicationNumber: publications
    }
}

function home(req, res){
    res.status(200).send({
        message: 'Hola mundo'
    });
};

function pruebas(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Accion pruebas en el servidor nodeJs'
    });
};


module.exports = {
    home,
    pruebas,
    saveUser,
    login,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadProfilePic,
    getProfilePic    
}