require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pool = require('./db');
const app = express();
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const courseRoutes = require('./routes/course');
const requireAuth = require("./middleware/requireAuth");

// Middleware
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        return callback(null, './public/Files')
    },
    filename: function(req, file, callback) {
        return callback(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage});

// routes
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/course', courseRoutes);

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to the server'});
})

app.post('/upload/:id', upload.single('file'), async (req, res) => {
    const {id} = req.params;
    const {originalname, filename} = req.file;
    const file = await pool.query("INSERT INTO files (name, path, visible, course_id) VALUES ($1, $2, $3, $4) RETURNING *", [originalname, filename, false, id]);
    res.json(file.rows[0]);
})

app.get("/upload/:id", requireAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const {role} = req.user;
        let allFiles;
        if (role === "student") {
            allFiles = await pool.query("SELECT * FROM files WHERE course_id = $1 AND visible = true");
        } else if (role === "teacher") {
            allFiles = await pool.query("SELECT * FROM files WHERE course_id = $1", [id]);
        } else {
            throw new Error("user role undefined");
        }
        res.json(allFiles.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Serve files
app.get("/files/:filename", (req, res) => {
    const {filename} = req.params;
    res.download(`./public/Files/${filename}`);
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT);
})
