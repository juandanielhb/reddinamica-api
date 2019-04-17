'use strict'

let express = require('express');
let api = express.Router();

let auth = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');
let controlAccess = require('../middlewares/controlAccess.middleware');

let lessonController = require('../controllers/lesson.controller');

const LESSON_PATH = '../uploads/lessons/';


api.post('/lesson', auth.ensureAuth, lessonController.saveLesson);
api.delete('/lesson/:id', auth.ensureAuth, lessonController.deleteLesson);
api.get('/lessons/:page?', auth.ensureAuth, lessonController.getLessons);
api.get('/all-lessons', auth.ensureAuth, lessonController.getAllLessons);
api.get('/suggest-lessons/:page?', auth.ensureAuth, lessonController.getSuggestLessons);
api.get('/experiences/:page?', auth.ensureAuth, lessonController.getExperiences);
api.put('/lesson/:id', auth.ensureAuth, lessonController.updateLesson);

// api.get('/user-lessons/:id/:page?', auth.ensureAuth, lessonController.getUserlessons);
// api.get('/lesson/:id', auth.ensureAuth, lessonController.getlesson);
// api.post('/upload-file-post/:id', [auth.ensureAuth, uploadMiddleware.uploadImage(POST_PATH)],lessonController.uploadlessonFile);
// api.get('/get-image-post/:file', lessonController.getPublicacionFile);

module.exports = api;
