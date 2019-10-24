'use strict'
let { ITEMS_PER_PAGE } = require('../config');
const LESSON_PATH = './uploads/lessons/';

// Services
let mail = require('../services/mail.service');

// Load libraries
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');
let fs = require('fs');
let path = require('path');

// Load models
let Lesson = require('../models/lesson.model');
let Comment = require('../models/comment.model');


function saveLesson(req, res) {
    let params = req.body;

    let lesson = new Lesson();

    lesson.title = params.title;
    lesson.resume = params.resume;
    lesson.references = params.references;
    lesson.development_level = params.development_level;
    lesson.type = params.type;
    lesson.knowledge_area = params.knowledge_area;
    lesson.author = params.author;
    lesson.accepted = params.accepted;
    lesson.justification = params.justification;
    lesson.state = params.state;

    if (params.version) {
        lesson.version = params.version;
    }

    lesson.created_at = moment().unix();

    lesson.save((err, lessonStored) => {
        if (err) return res.status(500).send({ message: 'Error in the request. The lesson can not be saved' });

        if (!lessonStored) return res.status(404).send({ message: 'The lesson has not been saved' });

        console.log(params.class)
        switch (params.class) {
            case 'suggest':
                    
                mail.sendMail(
                    'Nueva sugerencia de lección',
                    process.env.EMAIL,
                    `
                    <h3>Hola ${process.env.NAME}</h3>
                    <p>
                    Se ha registrado una sugerencia para lección con el título:
                    </p>
                    <p>
                    <strong>"${lessonStored.title}"</strong>
                    </p>
                    <p>
                    Ingresa al <strong>panel de administración > Lecciones > Propuestas </strong> de reddinámica para revisar la información 
                    de la nueva propuesta.
                    </p>
                    `
                );

                break;

            case 'experience':
                
                mail.sendMail(
                    'Nueva experencia registrada',
                    process.env.EMAIL,
                    `
                    <h3>Hola ${process.env.NAME}</h3>
                    <p>
                    Se ha registrado una experiencia con el título:
                    </p>
                    <p>
                    <strong>"${lessonStored.title}"</strong>
                    </p>
                    <p>
                    Ingresa al <strong>panel de administración > Lecciones > Experiencias </strong> de reddinámica para revisar la información 
                    de la nueva propuesta.
                    </p>
                    `
                );

                break;


                break;
        }


        return res.status(200).send({ lesson: lessonStored });
    });
}

function uploadLessonFiles(req, res) {

    if (req.files) {
        return res.status(200).send({ message: 'The files were uploaded correctly' });
    }
}

function getLessonFile(req, res) {
    let file = req.params.file;
    let pathFile = path.resolve(LESSON_PATH, file);


    fs.stat(pathFile, (err, stat) => {

        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(200).send({ message: 'The file does not exits' });
            } else { // en caso de otro error
                return res.status(500).send({ message: 'Error requesting the file.' });
            }
        }
        return res.sendFile(pathFile);
    });
}

function deleteLesson(req, res) {
    let lessonId = req.params.id;

    Lesson.findByIdAndRemove({ user: req.user.sub, '_id': lessonId }, (err, lessonRemoved) => {
        if (err) return res.status(500).send({ message: 'Error in the request. It can not be removed the lesson' });

        if (!lessonRemoved) return res.status(404).send({ message: 'The lesson has not been removed' });

        Comment.deleteMany({ '_id': { '$in': lessonRemoved.comments } }, (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error in the request. It can not be removed the lesson comments' });
            }

            return res.status(200).send({ lesson: lessonRemoved });
        })

    });
}

function updateLesson(req, res) {
    var lessonId = req.params.id;
    var updateData = req.body;

    Lesson.findByIdAndUpdate(lessonId, updateData, { new: true })
        .populate('development_group', 'name surname picture role _id')
        .populate('author', 'name surname picture role _id')
        .populate('expert', 'name surname picture role _id')
        .populate('leader', 'name surname picture role _id')
        .populate('call.interested', 'name surname role picture _id')
        .populate('conversations.author', 'name surname picture role _id')
        .populate('expert_comments.author', 'name surname picture role _id')
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'name surname picture _id' }
        })
        .exec((err, lessonUpdated) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The lesson can not be updated' });

            if (!lessonUpdated) return res.status(404).send({ message: 'The lesson has not been updated' });

            return res.status(200).send({ lesson: lessonUpdated });
        });
}

function getLesson(req, res) {
    let lessonId = req.params.id;

    Lesson.findById(lessonId)
        .populate('development_group', 'name surname picture role _id')
        .populate('author', 'name surname picture role _id')
        .populate('expert', 'name surname picture role _id')
        .populate('leader', 'name surname picture role _id')
        .populate('knowledge_area', 'name')
        .populate('conversations.author', 'name surname picture role _id')
        .populate('expert_comments.author', 'name surname picture role _id')
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'name surname picture _id' }
        }).populate('son_lesson','_id visible')
        .exec((err, lesson) => {
            if (err) return res.status(500).send({ message: 'Error in the request. lesson can not be found' });

            if (!lesson) return res.status(404).send({ message: 'lesson doesn\'t exist' });

            return res.status(200).send({ lesson });

        });
}

function getLessons(req, res) {
    var page = req.params.page;

    let findQuery = {
        accepted: true
    };

    if (req.params.visibleOnes == 'true') {
        findQuery.visible = true;
    }

    Lesson.find(findQuery).sort({created_at:-1})
        .sort('name')
        .populate('development_group', 'name surname picture role _id')
        .populate('author', 'name surname picture role _id')
        .populate('expert', 'name surname picture role _id')
        .populate('leader', 'name surname picture role _id')
        .populate('knowledge_area', 'name')
        .populate('call.interested', 'name surname role picture _id')
        .paginate(page, ITEMS_PER_PAGE, (err, lessons, total) => {

            if (err) return res.status(500).send({ message: 'Error in the request. The lessons were not found' });

            if (!lessons) return res.status(404).send({ message: 'No lessons were found' });

            return res.status(200).send({
                lessons: lessons,
                total: total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

function getAllLessons(req, res) {
    let order = {}; 

    let findQuery = {
        accepted: true
    };

    if (req.params.visibleOnes == 'true') {
        findQuery.visible = true;
    }

    if (req.params.order) {
        if(req.params.order == 'views'){
            order.views = -1;
        }else{
            order.score = -1;
        }
    }else{
        order.created_at = 1;
    }

    Lesson.find(findQuery).sort(order)
        .populate('development_group', 'name surname picture role _id')
        .populate('author', 'name surname picture role _id')
        .populate('expert', 'name surname picture role _id')
        .populate('leader', 'name surname picture role _id')
        .populate('knowledge_area', 'name')
        .populate('call.interested', 'name surname role picture _id')
        .exec((err, lessons) => {

            if (err) return res.status(500).send({ message: 'Error in the request. The lessons were not found' });

            if (!lessons) return res.status(404).send({ message: 'No lessons were found' });

            return res.status(200).send({ lessons: lessons });

        });
}

function getMyLessons(req, res) {
    let page = req.params.page;
    let userId = req.user.sub;

    Lesson.find({
        "accepted": true,
        $or: [
            { "author": userId },
            { "development_group": { $all: userId } }
        ]
    })
        .sort('name')
        .populate('knowledge_area', 'name')
        .populate('development_group', 'name surname picture role _id')
        .paginate(page, ITEMS_PER_PAGE, (err, lessons, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The lessons were not found' });

            if (!lessons) return res.status(404).send({ message: 'No lessons were found' });

            return res.status(200).send({
                lessons: lessons,
                total: total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

function getAllMyLessons(req, res) {
    let userId = req.user.sub;

    Lesson.find({
        "accepted": true,
        $or: [
            { "author": userId },
            { "development_group": { $all: userId } }
        ]
    })
        .sort('name')
        .populate('knowledge_area', 'name')
        .populate('development_group', 'name surname picture role _id')
        .exec((err, lessons) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The lessons were not found' });

            if (!lessons) return res.status(404).send({ message: 'No lessons were found' });

            return res.status(200).send({
                lessons: lessons
            });
        });
}

function getLessonsToAdvise(req, res) {
    let page = req.params.page;
    let userId = req.user.sub;

    Lesson.find({ "expert": userId })
        .sort('name')
        .populate('knowledge_area', 'name')
        .populate('development_group', 'name surname picture role _id')
        .paginate(page, ITEMS_PER_PAGE, (err, lessons, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The lessons were not found' });

            if (!lessons) return res.status(404).send({ message: 'No lessons were found' });

            return res.status(200).send({
                lessons: lessons,
                total: total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

function getAllLessonsToAdvise(req, res) {
    let userId = req.user.sub;

    Lesson.find({ "expert": userId })
        .sort('name')
        .populate('knowledge_area', 'name')
        .exec((err, lessons) => {
            if (err) return res.status(500).send({ message: 'Error in the request. The lessons were not found' });

            if (!lessons) return res.status(404).send({ message: 'No lessons were found' });

            return res.status(200).send({
                lessons: lessons
            });
        });
}

// A suggest lesson is the one that has "accepted" in false and has a justification
function getSuggestLessons(req, res) {
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    Lesson.find({ justification: { $ne: null }, accepted: false })
        .populate('author', 'name surname picture role _id')
        .sort('name').paginate(page, ITEMS_PER_PAGE, (err, lessons, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request. Could not get records' });

            if (!lessons) return res.status(404).send({ message: 'It was not found any record' });

            return res.status(200).send({
                lessons,
                total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

// A experience-lesson is the one that has "accepted" in false and has type and development_level
function getExperiences(req, res) {
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    Lesson.find({ development_level: { $ne: null }, type: { $ne: null }, accepted: false })
        .populate('author', 'name surname picture role _id')
        .populate('knowledge_area', 'name')
        .sort('name').paginate(page, ITEMS_PER_PAGE, (err, lessons, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request. Could not get records' });

            if (!lessons) return res.status(404).send({ message: 'It was not found any record' });

            return res.status(200).send({
                lessons,
                total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

async function removeFilesOfUpdates(res, httpCode, filePath, message) {
    await fs.unlink(filePath, (err) => {
        return res.status(httpCode).send({ message: message })
    });
}


function getCalls(req, res) {
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    Lesson.find({ "call.visible": true })
        .populate('call.interested', 'name surname role picture _id')
        .populate('knowledge_area', 'name')
        .paginate(page, ITEMS_PER_PAGE, (err, lessons, total) => {
            if (err) return res.status(500).send({ message: 'Error in the request. Could not get records' });

            if (!lessons) return res.status(404).send({ message: 'It was not found any record' });

            return res.status(200).send({
                lessons,
                total: total,
                pages: Math.ceil(total / ITEMS_PER_PAGE)
            });
        });
}

function getAllCalls(req, res) {

    Lesson.find({ "call.visible": true })
        .populate('call.interested', 'name surname role picture _id')
        .populate('knowledge_area', 'name')
        .exec((err, lessons) => {
            if (err) return res.status(500).send({ message: 'Error in the request. Could not get records' });

            if (!lessons) return res.status(404).send({ message: 'It was not found any record' });

            return res.status(200).send({ lessons });
        });
}

module.exports = {
    saveLesson,
    deleteLesson,
    updateLesson,
    getLessons,
    getLesson,
    getAllLessons,
    getMyLessons,
    getAllMyLessons,
    getLessonsToAdvise,
    getAllLessonsToAdvise,
    getSuggestLessons,
    getCalls,
    getAllCalls,
    getExperiences,
    uploadLessonFiles,
    getLessonFile
}



