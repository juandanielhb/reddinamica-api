'use strict'

exports.isAdmin = function(req, res, next){
    if(req.user.role == 'admin' || req.user.role == 'delegated_admin'){
        next();
    }else{
        res.status(403).send({message:'The user might not have the necessary permissions for a resource'})
    }
};
