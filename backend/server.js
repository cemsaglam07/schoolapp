require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const courseRoutes = require('./routes/course');

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

// routes
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/course', courseRoutes);

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to the server'});
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT);
})
