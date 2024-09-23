import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFilesContext } from "../hooks/useFilesContext";
import FileDetails from '../components/FileDetails';

const Course = () => {
    const {id} = useParams();
    const {user} = useAuthContext();
    const {files, dispatch} = useFilesContext();

    const [course, setCourse] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);

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

    useEffect(() => {
        const getFiles = async () => {
            const response = await fetch(`http://localhost:4000/upload/${id}/`, {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const json = await response.json();
            if (response.ok) {
                dispatch({type: 'SET_FILES', payload: json})
            }
        }

        if (user) {
            getFiles();
        }
    }, [dispatch, user, id])

    useEffect(() => {
        if (user) {
            getCourse();
            getStudents();
            getTeachers();
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
                    <div className="card">
                    <ul className="list-group list-group-flush">
                        {students && students.length === 0 ? (
                            <li className="list-group-item">No students found</li>
                        ) : (
                            students.map(student => (
                                <li className="list-group-item">{student.first_name} {student.last_name}</li>
                            ))
                        )}
                    </ul>
                    </div>

                    <h2>Teachers:</h2>
                    <div className="card">
                    <ul className="list-group list-group-flush">
                        {teachers && teachers.length === 0 ? (
                            <li className="list-group-item">No teachers found</li>
                        ) : (
                            teachers.map(teacher => (
                                <li className="list-group-item">{teacher.first_name} {teacher.last_name}</li>
                            ))
                        )}
                    </ul>
                    </div>
                </div>
                <div className="col">
                    <h2>Classroom material</h2>
                    {files && files.length === 0 ? (
                        <p>No files found</p>
                    ) : (
                        files.map(file => (
                            <FileDetails key={file.file_id} file={file} />
                        ))
                    )}
                </div>
            </div>
        </div>
        
        </>
    )
}

export default Course;