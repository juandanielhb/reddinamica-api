'use strict'

let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })

let uploadMiddleware = multer({
        storage,
        dest:  path.join(__dirname, '../public/uploads')
    }).single('image');


module.exports = uploadMiddleware;