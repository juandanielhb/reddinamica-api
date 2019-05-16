'use strict'
let moment = require('moment');
let bcrypt = require('bcrypt-nodejs');

let User = require('../models/user.model');

exports.createAdmin = function(){
    let user = new User();

    user.name = process.env.NAME || 'RedDinámica';
    user.surname = process.env.SURNAME || '';
    user.password = process.env.PASSWORD;
    user.email = process.env.EMAIL;
    user.role = 'admin';
    user.actived = true;
    user.about = 'Cuenta administrador de RedDinámica';
    
    user.created_at = moment().unix();

    // Check duplicate users
    User.find({ $or: [{ email: user.email }, { role: 'admin' }] }, (err, users) => {
        if (err) console.log('Error in the request. The admin can not be created');

        if (users && users.length >= 1) {
            return console.log('The administrator is already created.')
        } else {
            bcrypt.hash(user.password, null, null, (err, hash) => {
                user.password = hash;
                user.save((err, userStored) => {

                    if (err) console.log('Error in the request. The admin can not be created');

                    if (!userStored) console.log('The admin has not been saved');

                    console.log('The admin was created correctly');
                });
            });
        }
    });

}