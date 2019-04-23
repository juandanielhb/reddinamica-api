'use strict'

// app.js has all the set up for express
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

// Load routes
let institutionRoutes = require('./routes/institution.routes');
let cityRoutes = require('./routes/city.routes');
let knowledgeAreaRoutes = require('./routes/knowledgeArea.routes');
let professionRoutes = require('./routes/profession.routes');
let followRoutes = require('./routes/follow.routes');
let publicationRoutes = require('./routes/publication.routes');
let commentRoutes = require('./routes/comment.routes');
let messageRoutes = require('./routes/message.routes');
let resourceRoutes = require('./routes/resource.routes');
let lessonRoutes = require('./routes/lesson.routes');
let userRoutes = require('./routes/user.routes');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
     
    next();
});

// Routes
app.use('/api', cityRoutes);
app.use('/api', institutionRoutes);
app.use('/api', knowledgeAreaRoutes);
app.use('/api', professionRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', commentRoutes);
app.use('/api', messageRoutes);
app.use('/api', resourceRoutes);
app.use('/api', lessonRoutes);
app.use('/api', userRoutes);

// Export
module.exports = app;