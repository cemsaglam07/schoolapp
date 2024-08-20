const express = require('express');
const pool = require('../db');
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// Get all courses
router.get('/', requireAuth, async (req, res) => {
    try {
        const allCourses = await pool.query("SELECT * FROM courses");
        res.json(allCourses.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Get course
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const course = await pool.query("SELECT * FROM courses WHERE course_id = $1", [id]);
        res.json(course.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// Get course's students
router.get('/:id/students', async (req, res) => {
    try {
        const {id} = req.params;
        const course = await pool.query("SELECT s.student_id, s.first_name, s.last_name, s.date_of_birth, s.email, s.phone_number FROM student_courses sc JOIN students s ON sc.student_id = s.student_id WHERE sc.course_id = $1", [id]);
        res.json(course.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Get course's teachers
router.get('/:id/teachers', async (req, res) => {
    try {
        const {id} = req.params;
        const course = await pool.query("SELECT t.teacher_id, t.first_name, t.last_name, t.date_of_birth, t.email, t.phone_number FROM teacher_courses tc JOIN teachers t ON tc.teacher_id = t.teacher_id WHERE tc.course_id = $1", [id]);
        res.json(course.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Create course
router.post('/', async (req, res) => {
    try {
        const {course_name} = req.body;
        const newCourse = await pool.query("INSERT INTO courses (course_name) VALUES($1) RETURNING *", [course_name]);
        res.json(newCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// Add student to course
router.post('/:id/students/:student', async (req, res) => {
    try {
        const {id, student} = req.params;
        const newStudentCourse = await pool.query("INSERT INTO student_courses (student_id, course_id) VALUES($1, $2)", [student, id]);
        res.json(`Added student with ID ${student} to course with ID ${id}.`);
    } catch (err) {
        console.error(err.message);
    }
})

// Add teacher to course
router.post('/:id/teachers/:teacher', async (req, res) => {
    try {
        const {id, teacher} = req.params;
        const newTeacherCourse = await pool.query("INSERT INTO teacher_courses (teacher_id, course_id) VALUES($1, $2)", [teacher, id]);
        res.json(`Added teacher with ID ${teacher} to course with ID ${id}.`);
    } catch (err) {
        console.error(err.message);
    }
})

// Update course name
router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {course_name} = req.body;
        const updateCourse = await pool.query("UPDATE courses SET course_name = $1 WHERE course_id = $2 RETURNING *", [course_name, id]);
        res.json(updateCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// Delete course
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteStudentCourses = await pool.query("DELETE FROM student_courses WHERE course_id = $1", [id]);
        const deleteTeacherCourses = await pool.query("DELETE FROM teacher_courses WHERE course_id = $1", [id]);
        const deleteCourse = await pool.query("DELETE FROM courses WHERE course_id = $1 RETURNING *", [id]);
        res.json(deleteCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// Remove student from course
router.delete('/:id/students/:student', async (req, res) => {
    try {
        const {id, student} = req.params;
        const deleteStudentCourses = await pool.query("DELETE FROM student_courses WHERE course_id = $1 AND student_id = $2", [id, student]);
        res.json(`Removed student with ID ${student} from course with ID ${id}`);
    } catch (err) {
        console.error(err.message);
    }
})

// Remove teacher from course
router.delete('/:id/teachers/:teacher', async (req, res) => {
    try {
        const {id, teacher} = req.params;
        const deleteTeacherCourses = await pool.query("DELETE FROM teacher_courses WHERE course_id = $1 AND teacher_id = $2", [id, teacher]);
        res.json(`Removed student with ID ${teacher} from course with ID ${id}`);
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;