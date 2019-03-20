'use strict'
let uuidv4 = require('uuid/v4');

let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
    }
  })

let uploadImage = multer({
        storage,
        dest: path.join(__dirname, '../uploads'),
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

  let uploadFile = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Allowed extension files 
      const filetypes = /pdf|doc|txt|ppt|xls|avi|mpeg|mp4|mp3|jpeg|jpg|png|gif|svg/;
      const mimetype = filetypes.test(file.mimetype);
      const ext = path.extname(file.originalname);
      const extTest = filetypes.test(ext);

      if (mimetype && extTest){
        return cb(null, true);
      }

      return cb(`The ${ext} extension is not allowed!`);
    }
}).single('file');    


module.exports = {
  uploadImage,
  uploadFile
}