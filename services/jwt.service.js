'use strict'

let jwt = require('jwt-simple');
let moment = require ('moment');
let SECRET_KEY = process.env.SECRET_KEY;

exports.createToken = function(user){
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        about: user.about,
        gender: user.gender,
        state: user.state,
        role: user.role,
        postgraduate: user.postgraduate,
        picture: user.picture,
        knowledge_area:user.knowledge_area,
        profession: user.profession,
        institution: user.institution,
        city: user.city,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};