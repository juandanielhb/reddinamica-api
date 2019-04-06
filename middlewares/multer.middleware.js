'use strict'
let uuidv4 = require('uuid/v4');

let multer = require('multer');
let path = require('path');

let storageConfig = (targetPath, originalName = false) => {
  let storage;
  let fileName; 

  storage =  multer.diskStorage({
    destination: path.join(__dirname, targetPath),
    filename: (req, file, cb) => {
      if(!originalName){
        fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      }else{
        fileName = file.originalname;
      }

      cb(null, fileName)
    }
  });

  return storage;
}

let uploadImage = (targetPath) => {

  let storage = storageConfig(targetPath);

  return multer({
    storage,
    dest: path.join(__dirname, targetPath),
    fileFilter: (req, file, cb) => {
      // Allowed extension files 
      const filetypes = /jpeg|jpg|png|gif|svg/;
      const mimetype = filetypes.test(file.mimetype);
      const ext = path.extname(file.originalname);
      const extTest = filetypes.test(ext);

      if (mimetype && extTest) {
        return cb(null, true);
      }

      return cb(`The ${ext} extension is not allowed!`);
    },
    limits: {
      fileSize: 20 * 1000000
    }
  }).single('image');

}

let uploadFile = (targetPath) => {

  let storage = storageConfig(targetPath, true);

  return multer({
    storage,
    dest: path.join(__dirname, targetPath),
    fileFilter: (req, file, cb) => {
      // Allowed extension files 
      const filetypes = /pdf|doc|txt|ppt|xls|avi|mpeg|mp4|mp3|jpeg|jpg|png|gif|svg|exe|rar|zip/;
      const mimetype = filetypes.test(file.mimetype);      
      const ext = path.extname(file.originalname);
      const extTest = filetypes.test(ext);
      

      if (mimetype || extTest) {
        return cb(null, true);
      }

      return cb(`The ${ext} extension is not allowed!`);
    },
    limits: {
      fileSize: 20 * 1000000
    }
  }).single('file');

}

let uploadFiles = (targetPath) => {

  let storage = storageConfig(targetPath, true);

  return multer({
    storage,
    dest: path.join(__dirname, targetPath),
    fileFilter: (req, file, cb) => {
      // Allowed extension files 
      const filetypes = /pdf|doc|txt|ppt|xls|avi|mpeg|mp4|mp3|jpeg|jpg|png|gif|svg/;
      const mimetype = filetypes.test(file.mimetype);
      const ext = path.extname(file.originalname);
      const extTest = filetypes.test(ext);

      if (mimetype && extTest) {
        return cb(null, true);
      }

      return cb(`The ${ext} extension is not allowed!`);
    },
    limits: {
      fileSize: 20 * 1000000
    },
  }).array('file', 5);

}

module.exports = {
  uploadImage,
  uploadFile,
  uploadFiles
}