const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allTeachers = await pool.query("SELECT * FROM teachers");
        res.json(allTeachers.rows);
    } catch (err) {
        console.error(err.message);
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