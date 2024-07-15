const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allStudents = await pool.query("SELECT * FROM students");
        res.json(allStudents.rows);
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

router.post('/', async (req, res) => {
    try {
        const {first_name, last_name, date_of_birth, email, phone_number} = req.body;
        const newStudent = await pool.query("INSERT INTO students (first_name, last_name, date_of_birth, email, phone_number) VALUES($1, $2, $3, $4, $5) RETURNING *", [first_name, last_name, date_of_birth, email, phone_number]);
        res.json(newStudent.rows);
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