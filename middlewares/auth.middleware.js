'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let SECRET_KEY = process.env.SECRET_KEY;

exports.ensureAuth = function(req, res, next){
    let token, payload;
    
    if(!req.headers.authorization){
        return res.status(400).send({message: 'Request hasn\'t got authorization header'});
    }else{
        token = req.headers.authorization.replace(/['"]+/g,'');
    }
    try {
        payload = jwt.decode(token, SECRET_KEY);

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
