'use strict'
let { ITEMS_PER_PAGE } = require('../config');
const LESSON_PATH = './uploads/lessons/';

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');
let fs = require('fs');
let path = require('path');

// Load models
let Lesson = require('../models/lesson.model');


function saveLesson(req, res) {
    let params = req.body;

    let lesson = new Lesson();

    lesson.name = params.name;
    lesson.type = params.type; // [ document, video, link, software]
    lesson.description = params.description;
    lesson.source = params.source;
    lesson.justification = params.justification;
    lesson.author = params.author;
    lesson.accepted = params.accepted;
    lesson.created_at = moment().unix();    
    lesson.link = params.link;

    lesson.save((err, lessonStored) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The lesson can not be saved' });

        if (!lessonStored) return res.status(404).send({ message: 'The lesson has not been saved' });

        return res.status(200).send({ lesson: lessonStored });
    });
}

// function uploadLessonFile(req, res){
//     let lessonId = req.params.id;
//     let filePath = req.file.path;
//     let filename = req.file.filename;

//     if (req.file) {

//         lesson.findOne({'_id': lessonId }, (err, lesson) => {

//             if (lesson) {

//                 lesson.findByIdAndUpdate(lessonId, { file: filename }, { new: true }, (err, lessonUpdated) => {

//                     if (err) return removeFilesOfUpdates(res, 500, filePath, 'Error in the request. The lesson can not be upadated');

//                     if (!lessonUpdated) return removeFilesOfUpdates(res, 404, filePath, 'The lesson has not been updated');

//                     return res.status(200).send({ lesson: lessonUpdated });
//                 });

//             } else {
//                 return removeFilesOfUpdates(res, 403, filePath, 'You do not have permission to update user data');
//             }
//         });
//     } else {
//         return res.status(200).send({ message: 'No file has been uploaded' })
//     }
// }

// function getLessonFile(req, res){
//     let file = req.params.file;
//     let pathFile = path.resolve(LESSON_PATH, file);


//     fs.stat(pathFile, (err, stat) => {

//         if (err) {
//             if (err.code === 'ENOENT') {
//                 return res.status(200).send({ message: 'The file does not exits' });
//             } else { // en caso de otro error
//                 return res.status(500).send({ message: 'Error requesting the file.' });
//             }
//         }
//         return res.sendFile(pathFile);
//     });
// }

// function deleteLesson(req, res) {
//     let lessonId = req.params.id;

//     lesson.findByIdAndRemove({ user: req.user.sub, '_id': lessonId }, (err, lessonRemoved) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. It can not be removed the lesson' });

//         if (!lessonRemoved) return res.status(404).send({ message: 'The lesson has not been removed' });

//         Comment.remove({'_id':{'$in':lessonRemoved.comments}}, (err)=> {
//             if(err){
//                 return res.status(500).send({ message: 'Error in the request. It can not be removed the lesson comments' });
//             }

//             return res.status(200).send({ lesson: lessonRemoved });
//         })

//     });
// }

// function updateCity(req, res) {
//     var cityId = req.params.id;
//     var updateData = req.body;


//     City.findByIdAndUpdate(cityId, updateData, { new: true }, (err, cityUpdated) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The city can not be updated' });

//         if (!cityUpdated) return res.status(404).send({ message: 'The city has not been updated' });

//         return res.status(200).send({ city: cityUpdated });
//     });
// }

// function getCities(req, res) {
//     var page = 1;

//     if (req.params.page) {
//         page = req.params.page;
//     }

//     City.find().sort('name').paginate(page, ITEMS_PER_PAGE, (err, cities, total) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The cities were not found' });

//         if (!cities) return res.status(404).send({ message: 'No cities were found' });

//         return res.status(200).send({
//             cities: cities,
//             total: total,
//             pages: Math.ceil(total / ITEMS_PER_PAGE)
//         });
//     });
// }

// function getAllCities(req, res) {

//     City.find().sort('name').exec((err, cities) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The cities were not found' });

//         if (!cities) return res.status(404).send({ message: 'No cities were found' });

//         return res.status(200).send({ cities: cities });

//     });
// }

// function deletecity(req, res) {
//     var cityId = req.params.id;

//     City.findOneAndRemove({ _id: cityId, used: "false" }, (err, cityRemoved) => {
//         if (err) return res.status(500).send({ message: 'Error in the request. The city can not be removed ' });

//         if (!cityRemoved) return res.status(404).send({ message: 'The city can not be removed, it has already been used or it has not been found' });

//         return res.status(200).send({ city: cityRemoved });
//     });
// }

// async function removeFilesOfUpdates(res, httpCode, filePath, message) {
//     await fs.unlink(filePath, (err) => {
//         return res.status(httpCode).send({ message: message })
//     });
// }

module.exports = {
    saveLesson,
    uploadLessonFile,
    getLessonFile,
    deleteLesson
}



