'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var {SECRET_KEY} = require ('../config');

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(400).send({message: 'Request hasn\'t got authorization header'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g,'');
    }

    try {
        var payload = jwt.decode(token, SECRET_KEY);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: 'Session token has expired'
            });
        }
        
    } catch (ex) {
        return res.status(403).send({
            message: 'Invalid token'
        });
    }

    req.user = payload;

    next();
};
