const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const requireAuth = require("../middleware/requireAuth");

router.get('/', async (req, res) => {
    try {
        const allTeachers = await pool.query("SELECT * FROM teachers");
        res.json(allTeachers.rows);
    } catch (err) {
        console.error(err.message);
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log("email: ", email);
        console.log("password: ", password);
        const teacher = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);
        if (teacher.rows.length !== 1) {
            return res.status(400).send({error: "Email not found"});
        }
        const {teacher_id, pwd} = teacher.rows[0];
        const passwordCheck = await bcrypt.compare(password, pwd);
        if (!passwordCheck) {
            return res.status(400).send({error: "Passwords does not match"});
        }
        const token = jwt.sign({userId: teacher_id, userEmail: email, role: 'teacher'}, process.env.TOKEN, { expiresIn: "24h" });
        res.status(200).send({email, token, role: "teacher"});
    } catch (err) {
        console.error(err.message);
        res.status(400).send({error: err.message});
    }
})

router.post('/register', async (req, res) => {
    const {first_name, last_name, date_of_birth, email, phone_number, password} = req.body;
    try {
        const pwd = await bcrypt.hash(password, 10);
        const newTeacher = await pool.query(
            "INSERT INTO teachers (first_name, last_name, date_of_birth, email, phone_number, pwd) VALUES($1, $2, $3, $4, $5, $6) RETURNING first_name, last_name, date_of_birth, email, phone_number, pwd",
            [first_name, last_name, date_of_birth, email, phone_number, pwd]
        );
        const {teacher_id} = newTeacher.rows[0];
        const token = jwt.sign({userId: teacher_id, userEmail: email, role: 'teacher'}, process.env.TOKEN, { expiresIn: "24h" });
        res.status(200).send({email, token, role: "teacher"});
    } catch (err) {
        res.status(400).send({error: err.message});
    } 
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const teacher = await pool.query("SELECT * FROM teachers WHERE teacher_id = $1", [id]);
        res.json(teacher.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

router.get('/:id/courses', async (req, res) => {
    try {
        const {id} = req.params;
        const course = await pool.query("SELECT c.course_id, c.course_name FROM courses c JOIN teacher_courses tc ON c.course_id = tc.course_id WHERE tc.teacher_id = $1", [id]);
        res.json(course.rows)
    } catch (err) {
        console.error(err.message);
    }
})

router.post('/', async (req, res) => {
    try {
        const {first_name, last_name, date_of_birth, email, phone_number} = req.body;
        const newTeacher = await pool.query("INSERT INTO teachers (first_name, last_name, date_of_birth, email, phone_number) VALUES($1, $2, $3, $4, $5) RETURNING *", [first_name, last_name, date_of_birth, email, phone_number]);
        res.json(newTeacher.rows);
    } catch (err) {
        console.error(err.message);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteTeacherCourses = await pool.query("DELETE FROM teacher_courses WHERE teacher_id = $1", [id]);
        const deleteTeacher = await pool.query("DELETE FROM teachers WHERE teacher_id = $1", [id]);
        res.json(`Deleted teacher with ID ${id}`);
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;