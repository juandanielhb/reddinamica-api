'use strict'

let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })

let uploadMiddleware = multer({
        storage,
        dest:  path.join(__dirname, '../uploads'),
        fileFilter: (req, file, cb) => {
          // Allowed extension files 
          const filetypes = /jpeg|jpg|png|gif|svg/;
          const mimetype = filetypes.test(file.mimetype);
          const ext = path.extname(file.originalname);
          const extTest = filetypes.test(ext);

          if (mimetype && extTest){
            return cb(null, true);
          }

          return cb(`The ${ext} extension is not allowed!`);
        }
    }).single('image');


module.exports = uploadMiddleware;