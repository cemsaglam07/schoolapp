require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pool = require('./db');
const path = require('path');
const fs = require('fs');
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
            allFiles = await pool.query("SELECT * FROM files WHERE course_id = $1 AND visible = true", [id]);
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

app.delete("/upload/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const response = await pool.query("SELECT path FROM files WHERE file_id = $1", [id]);
        const filePath = path.join(__dirname, 'public', 'Files', response.rows[0].path);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ error: "File not found on server" });
            }
            fs.unlink(filePath, async (err) => {
                if (err) {
                    return res.status(500).json({ error: "Error deleting the file" });
                }
                const deleteFile = await pool.query("DELETE FROM files WHERE file_id = $1 RETURNING *", [id]);
                res.json(deleteFile.rows[0]);
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.put("/upload/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {method} = req.body;
        if (method === "nameChange") {
            const {filename} = req.body;
            const updateCourse = await pool.query("UPDATE files SET name = $1 WHERE file_id = $2 RETURNING *", [filename, id]);
            res.json(updateCourse.rows[0])
        } else if (method === "visibility") {
            const {visible} = req.body;
            // TODO: Implement visibility toggle
        }
        
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
