'use strict'

// Libraries
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');
let fs = require('fs');
let path = require('path');
let uuidv4 = require('uuid/v4');

// Services
let jwt = require('../services/jwt.service');
let mail = require('../services/mail.service');

// Models
let User = require('../models/user.model');
let Follow = require('../models/follow.model');
let Publication = require('../models/publication.model');

// Constant
const { ITEMS_PER_PAGE } = require('../config');
const USERS_PATH = './uploads/users/';


function saveUser(req, res) {
    let params = req.body;
    let user = new User();

    if (params.name && params.surname && params.email &&
        params.password && params.role) {

        user.name = params.name;
        user.surname = params.surname;
        user.password = params.password;
        user.email = params.email.toLowerCase();
        user.about = params.about;
        user.role = params.role;
        user.postgraduate = params.postgraduate;
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

                        mail.sendMail(
                            'Nuevo usuario registrado',
                            process.env.EMAIL,
                            `
                            <h3>Hola ${process.env.NAME}</h3>
                            <p>Se ha registrado el usuario 
                            <strong>${userStored.name} ${userStored.surname}</strong>
                             con el correo electrónico 
                            ${userStored.email}.</p>
                            <p>
                            Ingresa al <strong>panel de administración</strong> de reddinámica para revisar la información 
                             del nuevo usuario.
                             </p>
                            `
                        );

                        userStored.password = null;
                        return res.status(200).send({ user: userStored });
                    });
                });
            }
        });

    } else {
        return res.status(200).send({ message: 'You must fill all the required fields' });
    }
}

function saveUserByAdmin(req, res) {
    let params = req.body;
    let user = new User();

    params.password = uuidv4().substr(0, 6);

    if (params.name && params.surname && params.email && params.role) {

        user.name = params.name;
        user.surname = params.surname;
        user.password = params.password;
        user.email = params.email.toLowerCase();
        user.about = params.about;
        user.actived = true;
        user.role = params.role;
        user.postgraduate = params.postgraduate;
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

                        mail.sendMail(
                            'Contraseña Reddinámica',
                            userStored.email,
                            `
                            <h3>Bienvenido a RedDinámica</h3>
                            <p>La contraseña de inicio de sesión en RedDinámica es:  <strong>${params.password}</strong></p>
                            
                            Se recomienda cambiar la contraseña una vez se inicie sesión, esto se puede realizar ingresando a <strong>Opciones de seguridad</strong>.`
                        );

                        userStored.password = null;
                        return res.status(200).send({ user: userStored });
                    });
                });
            }
        });

    } else {
        return res.status(200).send({ message: 'You must fill all the required fields *****' });
    }
}



function login(req, res) {
    let params = req.body;

    let email = params.email;
    let password = params.password;
    // Views is incremented by 0.5 because when is called login in the client is called 
    // twice
    User.findOneAndUpdate({ email: email }, { $inc: { visits: 0.5 } }, { new: true })
        .populate('city')
        .populate('profession')
        .populate('institution')
        .exec((err, user) => {
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

function validatePassword(req, res) {
    let params = req.body;

    let password = params.password;
    let email = req.user.email;

    User.findOne({ email: email })
        .exec((err, user) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The user can not be validate' });

            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    return res.status(200).send(check);
                });
            } else {
                return res.status(404).send({ message: 'The user cannot be found' });
            }

        });
}

function changePassword(req, res) {
    let params = req.body;
    let password = params.password;
    let userId = req.user.sub;

    bcrypt.hash(password, null, null, (err, hash) => {

        User.findByIdAndUpdate(userId, { password: hash }, { new: true })
            .exec((err, userUpdated) => {

                if (err) return res.status(500).send({ message: 'Error in the request. User has not been updated' });

                if (!userUpdated) return res.status(404).send({ message: 'The user can not be updated' });

                userUpdated.password = null;
                return res.status(200).send({ user: userUpdated });
            });
    });
}

function recoverPassword(req, res) {
    let params = req.body;
    let password = uuidv4().substr(0, 6);

    bcrypt.hash(password, null, null, (err, hash) => {

        User.findOneAndUpdate({ email: params.email }, { password: hash }, { new: true })
            .exec((err, userUpdated) => {

                if (err) return res.status(500).send({ message: 'Error in the request. User has not been updated' });

                if (!userUpdated) return res.status(404).send({ message: 'The user can not be updated' });

                mail.sendMail(
                    'Nueva contraseña Reddinámica',
                    userUpdated.email,
                    `
                    <h3>Su contraseña de ingreso a RedDinámica se ha cambiado</h3>
                    <p>
                    Su nueva contraseña de inicio de sesión en RedDinámica es:  <strong>${password}</strong>
                    </p>
                    <p>
                    Se recomienda cambiar la contraseña una vez se inicie sesión, esto se puede realizar ingresando a <strong>Opciones de seguridad</strong>.
                    </p>
                    `
                );

                userUpdated.password = null;
                return res.status(200).send({ user: userUpdated });
            });
    });

}

function getUser(req, res) {
    let userId = req.params.id;

    User.findById(userId)
        .populate('city')
        .populate('profession')
        .populate('institution')
        .exec((err, user) => {
            if (err) return res.status(500).send({ message: 'Error in the request. User can not be found' });

            if (!user) return res.status(404).send({ message: 'User doesn\'t exist' });

            user.password = null;

            followThisUser(req.user.sub, userId).then((value) => {
                return res.status(200).send({
                    user,
                    following: value.following,
                    follower: value.follower
                });
            });
        });
}

// A new user is the one that has "actived" in false
function getNewUsers(req, res) {
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    User.find({ actived: false }, '-password').sort('name')
        .populate('city')
        .populate('profession')
        .populate('institution')
        .paginate(page, ITEMS_PER_PAGE, (err, users, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request. Could not get records' });

            if (!users) return res.status(404).send({ message: 'It was not found any user' });


            return res.status(200).send({
                users,
                total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    // Delete password property
    delete update.password;


    if (userId != req.user.sub) {
        if (!['admin', 'delegated_admin'].includes(req.user.role)) {
            return res.status(401).send({ message: 'You do not have permission to update user data' });
        }
    }

    User.findByIdAndUpdate(userId, update, { new: true })
        .populate('city')
        .populate('profession')
        .populate('institution')
        .exec((err, userUpdated) => {

            if (err) return res.status(500).send({ message: 'Error in the request. User has not been updated' });

            if (!userUpdated) return res.status(404).send({ message: 'The user can not be updated' });

            userUpdated.password = null;            
            return res.status(200).send({ user: userUpdated });
        });

}

function deleteUser(req, res) {

    let userId = req.params.id;
    let user = {
        name:'Usuario RedDinámica',
        surname:'',
        password:'',
        email:'',
        about:'',        
        role:'',
        postgraduate:'',
        knowledge_area:'',
        profession:null,
        institution:null,
        city:null,
        created_at:moment().unix()
    }   

    if (!userId) {
        userId = req.user.sub;
    }

    User.findOneAndUpdate({ _id: userId }, user, (err, userRemoved) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The user can not be removed' });

        if (!userRemoved) return res.status(404).send({ message: 'The user can not be removed, it has not been found' });

        Follow.find({ $or: [{ followed: userId }, { user: userId }] }).remove().exec();
        Publication.find({ user: userId }).remove().exec();

        return res.status(200).send({ user: userRemoved });
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

            userUpdated.password = null;
            return res.status(200).send({ user: userUpdated });
        });

    } else {
        return res.status(200).send({ message: 'No file has been uploaded' })
    }
}

function getProfilePic(req, res) {
    let imageFile = req.params.imageFile;
    let pathFile = path.resolve(USERS_PATH, imageFile);


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

    let following = await Follow.findOne({ "user": identityUserId, "followed": userId }, (err, follow) => {
        if (err) return handleError(err);

        return follow;
    });

    let follower = await Follow.findOne({ "user": userId, "followed": identityUserId }, (err, follow) => {
        if (err) return handleError(err);

        return follow;
    });

    return {
        following: following,
        follower: follower
    }
}

function getUsers(req, res) {
    let userId = req.user.sub;
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    User.find({name:{$ne: 'Usuario RedDinámica'}},'-password').sort('name')
        .populate('city')
        .populate('profession')
        .populate('institution')
        .paginate(page, ITEMS_PER_PAGE, (err, users, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request' });

            if (!users) return res.status(404).send({ message: 'There are no users' });

            
            followsUserId(userId).then((value) => {
                return res.status(200).send({
                    users,
                    following: value.following,
                    followers: value.followers,
                    total,
                    pages: Math.ceil(total / ITEMS_PER_PAGE),

                });
            });

        });
}

function getAllUsers(req, res) {
    let userId = req.user.sub;

    User.find({name:{$ne: 'Usuario RedDinámica'}}, '-password').sort('name')
        .populate('city')
        .populate('profession')
        .populate('institution')
        .exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error in the request' });

            if (!users) return res.status(404).send({ message: 'There are not users' });

            followsUserId(userId).then((value) => {
                return res.status(200).send({
                    users,
                    following: value.following,
                    followers: value.followers
                });
            });

        });
}

async function followsUserId(userId) {

    let following = await Follow.find({ user: userId }, { '_id': 0, '_v': 0, 'user': 0 }, (err, follows) => {
        return follows;
    });

    let following_clean = [];

    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });

    let followers = await Follow.find({ followed: userId }, { '_id': 0, '_v': 0, 'followed': 0 }, (err, follows) => {
        return follows;
    });

    let followers_clean = [];

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
    let userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value)
    });

}

async function getCountFollow(userId) {
    let following = await Follow.countDocuments({ user: userId }, (err, count) => {
        if (err) return handleError(err);

        return count;
    });

    let followed = await Follow.countDocuments({ followed: userId }, (err, count) => {
        if (err) return handleError(err);

        return count;
    });

    let publications = await Publication.countDocuments({ user: userId }, (err, count) => {
        if (err) return handleError(err);

        return count;
    });

    return {
        following: following,
        followed: followed,
        publications: publications
    }
}




module.exports = {
    saveUser,
    saveUserByAdmin,
    login,
    validatePassword,
    changePassword,
    recoverPassword,
    getUser,
    getUsers,
    getAllUsers,
    getNewUsers,
    getCounters,
    updateUser,
    deleteUser,
    uploadProfilePic,
    getProfilePic

}