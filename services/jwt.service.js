'use strict'

var jwt = require('jwt-simple');
var moment = require ('moment');
var {SECRET_KEY} = require ('../config');

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        about: user.about,
        gender: user.gender,
        state: user.state,
        is_actived: user.is_actived,
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