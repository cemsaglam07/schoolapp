import {useParams} from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const TeacherCourse = () => {
    const {id} = useParams();
    const {user} = useAuthContext();

    const [course, setCourse] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [studentOptions, setStudentOptions] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState();
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState();

    const [file, setFile] = useState([]);
    const [files, setFiles] = useState([]);

    const getCourse = async () => {
        const response = await fetch(`http://localhost:4000/api/course/${id}`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        const json = await response.json();
        setCourse(json);
    }

    const getStudents = async () => {
        const response = await fetch(`http://localhost:4000/api/course/${id}/students`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        const json = await response.json();
        setStudents(json);
    }

    const getTeachers = async () => {
        const response = await fetch(`http://localhost:4000/api/course/${id}/teachers`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        const json = await response.json();
        setTeachers(json);
    }

    const getStudentOptions = async () => {
        const response = await fetch('http://localhost:4000/api/student/', {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        const json = await response.json();
        setStudentOptions(json);
    }

    const addStudentToCourse = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return;
        const response = await fetch(`http://localhost:4000/api/course/${id}/students/${selectedStudent}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            getStudents();
        }
    };

    const getTeacherOptions = async () => {
        const response = await fetch('http://localhost:4000/api/teacher/', {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        const json = await response.json();
        setTeacherOptions(json);
    }

    const addTeacherToCourse = async (e) => {
        e.preventDefault();
        if (!selectedTeacher) return;
        const response = await fetch(`http://localhost:4000/api/course/${id}/teachers/${selectedTeacher}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            getTeachers();
        }
    };

    const deleteStudent = async (studentId) => {
        const response = await fetch(`http://localhost:4000/api/course/${id}/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            getStudents();
        }
    };

    const deleteTeacher = async (teacherId) => {
        const response = await fetch(`http://localhost:4000/api/course/${id}/teachers/${teacherId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            getTeachers();
        }
    };

    const upload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`http://localhost:4000/upload/${id}`, formData).catch(err => console.log(err));
        if (response.status === 200) { // response.ok
            getFiles();
        }
    }

    const getFiles = async () => {
        const response = await fetch(`http://localhost:4000/upload/${id}/`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        const json = await response.json();
        setFiles(json);
    }

    const deleteFiles = async (fileId) => {
        const response = await fetch(`http://localhost:4000/upload/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            getFiles();
        }
    }

    useEffect(() => {
        if (user) {
            getCourse();
            getStudents();
            getTeachers();
            getStudentOptions();
            getTeacherOptions();
            getFiles();
        }
    }, [user, id]);

    return (
        <>
        <h1 className="text-center">{course.course_name}</h1>
        <p className="text-center"><strong>Course ID: </strong>{course.course_id}</p>
        <hr />

        <div className="container">
            <div className="row">
                <div className="col-sm-3">
                    <h2>Students:</h2>
                    <form onSubmit={addStudentToCourse}>
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                            <option value="">Select a student</option>
                            {studentOptions.map(student => (
                                <option key={student.student_id} value={student.student_id}>
                                    {student.first_name} {student.last_name}
                                </option>
                            ))}
                        </select>
                        <button type="submit">Add Student</button>
                    </form>

                    {students && students.length === 0 ? (
                        <p>No students found</p>
                    ) : (
                        students.map(student => (
                            <div className="card" key={student.student_id}>
                            <div className="card-body d-flex flex-row">
                                <p className="card-title flex-grow-1">{student.first_name} {student.last_name}</p>
                                <button className="btn btn-danger" onClick={() => deleteStudent(student.student_id)}>Delete</button>
                            </div>
                            </div>
                        ))
                    )}

                    <h2>Teachers:</h2>
                    
                    <form onSubmit={addTeacherToCourse}>
                        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                            <option value="">Select a teacher</option>
                            {teacherOptions.map(teacher => (
                                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                    {teacher.first_name} {teacher.last_name}
                                </option>
                            ))}
                        </select>
                        <button type="submit">Add Teacher</button>
                    </form>
                    

                    {teachers && teachers.length === 0 ? (
                        <p>No teachers found</p>
                    ) : (
                        teachers.map(teacher => (
                            <div className="card" key={teacher.student_id}>
                            <div className="card-body d-flex flex-row">
                                <p className="card-title flex-grow-1">{teacher.first_name} {teacher.last_name}</p>
                                <button className="btn btn-danger" onClick={() => deleteTeacher(teacher.teacher_id)}>Delete</button>
                            </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="col">
                    <h2>Classroom material</h2>
                    <form action="/upload" encType="multipart/form-data">
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="upload" onChange={(e) => setFile(e.target.files[0])}  />
                            <button className="btn btn-outline-secondary" type="button" onClick={upload}>Upload</button>
                        </div>
                    </form>

                    {files && files.length === 0 ? (
                        <p>No files found</p>
                    ) : (
                        files.map(file => (
                            <div className="card" key={file.file_id}>
                            <div className="card-body d-flex flex-row">
                                <p className="card-title flex-grow-1">{file.name}</p>
                                <p>{file.file_id}</p>
                                <Link to={`/files/${file.path}`}>
                                    <button className="btn btn-success">
                                        Download
                                    </button>
                                </Link>
                                <button className="btn btn-danger" onClick={() => deleteFiles(file.file_id)}>Delete</button>
                            </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        
        </>
    )
}

export default TeacherCourse;