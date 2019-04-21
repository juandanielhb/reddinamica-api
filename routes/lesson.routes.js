'use strict'

let express = require('express');
let api = express.Router();

let auth = require('../middlewares/auth.middleware');
let uploadMiddleware = require('../middlewares/multer.middleware');
let controlAccess = require('../middlewares/controlAccess.middleware');

let lessonController = require('../controllers/lesson.controller');

const LESSON_PATH = '../uploads/lessons/';


api.post('/lesson', auth.ensureAuth, lessonController.saveLesson);

// api.post('/upload-lesson/:id', [auth.ensureAuth, uploadMiddleware.uploadFile(lesson_PATH)],lessonController.uploadlessonFile);
// api.get('/get-lesson/:file', lessonController.getlessonFile);

api.put('/lesson/:id', auth.ensureAuth, lessonController.updateLesson);

api.delete('/lesson/:id', auth.ensureAuth, lessonController.deleteLesson);

api.get('/lesson/:id', auth.ensureAuth , lessonController.getLesson);
api.get('/lessons/:visibleOnes/:page?', auth.ensureAuth, lessonController.getLessons);
api.get('/all-lessons/:visibleOnes/:order?', auth.ensureAuth, lessonController.getAllLessons);

api.get('/suggest-lessons/:page?', auth.ensureAuth, lessonController.getSuggestLessons);
api.get('/experiences/:page?', auth.ensureAuth, lessonController.getExperiences);
api.get('/calls/:page?', lessonController.getCalls);
api.get('/all-calls', lessonController.getCalls);

module.exports = api;
