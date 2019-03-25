'use strict'

// Libraries
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');
let fs = require('fs');
let path = require('path');

// Services
let jwt = require('../services/jwt.service');

// Models
let User = require('../models/user.model');

// Constant
const { ITEMS_PER_PAGE } = require('../config');
const USERS_PATH = './uploads/users/';

function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.email &&
        params.password && params.role) {

        user.name = params.name;
        user.surname = params.surname;
        user.password = params.password;
        user.email = params.email.toLowerCase();
        user.about = params.about;
        user.state = params.state;
        user.role = params.role;
        user.postgraduate = params.postgraduate;
        user.picture = params.picture;
        user.knowledge_area = params.knowledge_area;
        user.profession = params.profession;
        user.institution = params.institution;
        user.city = params.city;
        user.created_at = moment().unix();

        // Check duplicate users
        User.find({ email: user.email }, (err, users) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The user can not be found' });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'User already exists' });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({ message: 'Error in the request. The user can not be saved' });

                        if (!userStored) return res.status(404).send({ message: 'The user has not been saved' });

                        return res.status(200).send({ user: userStored });
                    });
                });
            }
        });

    } else {
        return res.status(200).send({ message: 'You must fill all the required fields' });
    }
}

function login(req, res) {
    var params = req.body;
    
    var email = params.email;
    var password = params.password;
    // Views is incremented by 0.5 because when is called login in the client is called 
    // twice
    User.findOneAndUpdate({ email: email }, {$inc: {visits: 0.5}}, {new: true}, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The user can not be logged in' });
        
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                
                if (check) {
                    

                    if (params.getToken) {
                        // Generate and return token
                        return res.status(200).send({ token: jwt.createToken(user) });
                    } else {
                        // Return user data
                        user.password = null;
                        return res.status(200).send({ user: user });
                    }
                } else {
                    return res.status(200).send({ 
                        message: 'The user can not be logged in!',
                        email: true
                 });
                }
            });
            
        } else {
            return res.status(200).send({ 
                message: 'The email is not registered',
                email: false
            });
        }
    });
}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error in the request. User can not be found' });

        if (!user) return res.status(404).send({ message: 'User doesn\'t exist' });

        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user,
                value
            });
        });
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    // Delete password property
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(401).send({ message: 'You do not have permission to update user data' });
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        // console.log(err);
        if (err) return res.status(500).send({ message: 'Error in the request. User has not been updated' });

        if (!userUpdated) return res.status(404).send({ message: 'The user can not be updated' });

        return res.status(200).send({ user: userUpdated });
    });

}

// Upload profile photo
function uploadProfilePic(req, res) {
    let userId = req.params.id;
    let filePath = req.file.path;
    let filename = req.file.filename;

    if (req.file) {

        if (userId != req.user.sub) {
            return removeFilesOfUpdates(res, 403, filePath, 'You do not have permission to update user data');
        }

        User.findByIdAndUpdate(userId, { picture: filename }, { new: true }, (err, userUpdated) => {

            if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The image user can not be upadated');

            if (!userUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The user has not been updated');

            return res.status(200).send({ user: userUpdated });
        });

    } else {
        return res.status(200).send({ message: 'No file has been uploaded' })
    }
}

function getProfilePic(req, res) {
    let imageFile = req.params.imageFile;
    let pathFile = path.resolve(USERS_PATH, imageFile);
    console.log(pathFile);

    // Validate if the file exists
    fs.stat(pathFile, (err, stat) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(200).send({ message: 'The image does not exits' });
            } else { // en caso de otro error
                return res.status(500).send({ message: 'Error requesting the image.' });
            }
        }
        return res.sendFile(pathFile);
    });
}

async function followThisUser(identityUserId, userId) {

    var following = await FollowModel.findOne({ "user": identityUserId, "followed": userId }, (err, follow) => {
        if (err) return handleError(err);

        return follow;
    });

    var follower = await FollowModel.findOne({ "user": userId, "followed": identityUserId }, (err, follow) => {
        if (err) return handleError(err);

        return follow;
    });

    return {
        following: following,
        follower: follower
    }
}

function getUsers(req, res) {
    let userIdLoggedIn = req.user.sub;
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    User.find().sort('name').paginate(page, ITEMS_PER_PAGE, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles' });

        followsUserId(userIdLoggedIn).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_followers: value.followers,
                total,
                pages: Math.ceil(total / ITEMS_PER_PAGE),

            });
        });

    });
}

async function followsUserId(userId) {
    console.log(userId);
    var following = await FollowModel.find({ user: userId }, { '_id': 0, '_v': 0, 'user': 0 }, (err, follows) => {
        return follows;
    });

    var following_clean = [];

    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });

    var followers = await FollowModel.find({ followed: userId }, { '_id': 0, '_v': 0, 'followed': 0 }, (err, follows) => {
        return follows;
    });

    var followers_clean = [];

    followers.forEach((follow) => {
        followers_clean.push(follow.user);
    });


    return {
        following: following_clean,
        followers: followers_clean
    };
}





async function removeFilesOfUpdates(res, httpCode, filePath, message) {
    await fs.unlink(filePath, (err) => {
        return res.status(httpCode).send({ message: message })
    });
}

function getCounters(req, res) {
    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value)
    });

}

async function getCountFollow(userId) {
    var following = await FollowModel.count({ user: userId }, (err, count) => {
        if (err) return handleError(err);

        return count;
    });

    var followed = await FollowModel.count({ followed: userId }, (err, count) => {
        if (err) return handleError(err);

        return count;
    });

    var publications = await PublicationModel.count({ user: userId }, (err, count) => {
        if (err) return handleError(err);

        return count;
    });

    return {
        followingNumber: following,
        followedNumber: followed,
        publicationNumber: publications
    }
}

module.exports = {
    saveUser,
    login,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadProfilePic,
    getProfilePic
}