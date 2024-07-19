const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("../auth");


router.get('/', async (req, res) => {
    try {
        const allStudents = await pool.query("SELECT * FROM students");
        res.json(allStudents.rows);
    } catch (err) {
        console.error(err.message);
    }
})

router.get('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const student = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
        if (student.rows.length !== 1) {
            res.status(400).send({"msg": "Email not found"});
        } else {
            const {student_id, pwd} = student.rows[0];
            bcrypt.compare(password, pwd).then((passwordCheck) => {
                if (!passwordCheck) {
                    return res.status(400).send({message: "Passwords does not match", error});
                }
                const token = jwt.sign({userId: student_id, userEmail: email}, process.env.TOKEN, { expiresIn: "24h" });
                res.status(200).send({message: "Login successful", email: email, token});
            })
        }
    } catch (err) {
        console.error(err.message);
    }
})


// authentication endpoint
router.get("/auth-endpoint", auth, (req, res) => {
    res.json({ message: "You are authorized to access me" });
  });

router.post('/register', async (req, res) => {
    try {
        const {first_name, last_name, date_of_birth, email, phone_number, password} = req.body;
        bcrypt.hash(password, 10).then((async pwd => {
            const newStudent = await pool.query("INSERT INTO students (first_name, last_name, date_of_birth, email, phone_number, pwd) VALUES($1, $2, $3, $4, $5, $6) RETURNING first_name, last_name, date_of_birth, email, phone_number, pwd", [first_name, last_name, date_of_birth, email, phone_number, pwd]);
            res.json(newStudent.rows);
        }))
    } catch (err) {
        console.error(err.message);
    } 
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const student = await pool.query("SELECT * FROM students WHERE student_id = $1", [id]);
        res.json(student.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

router.get('/:id/courses', async (req, res) => {
    try {
        const {id} = req.params;
        const course = await pool.query("SELECT c.course_id, c.course_name FROM courses c JOIN student_courses sc ON c.course_id = sc.course_id WHERE sc.student_id = $1", [id]);
        res.json(course.rows)
    } catch (err) {
        console.error(err.message);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteStudentCourses = await pool.query("DELETE FROM student_courses WHERE student_id = $1", [id]);
        const deleteStudent = await pool.query("DELETE FROM students WHERE student_id = $1", [id]);
        res.json(`Deleted student with ID ${id}`);
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;