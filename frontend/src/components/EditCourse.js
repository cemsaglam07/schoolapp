import React, { Fragment, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCoursesContext } from "../hooks/useCoursesContext";

const EditCourse = ({course}) => {
    const {user} = useAuthContext();
    const {dispatch} = useCoursesContext();

    const [courseName, setCourseName] = useState(course.course_name);
    
    const updateCourse = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }
        try {
            const body = {course_name: courseName};
            const response = await fetch(`http://localhost:4000/api/course/${course.course_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(body)
            })
            const json = await response.json();
            if (response.ok) {
                dispatch({type: 'EDIT_COURSE_NAME', payload: json});
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <>
            <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target={`#id${course.course_id}`}>
            Edit
            </button>

            <div class="modal fade" id={`id${course.course_id}`} tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true" onClick={() => setCourseName(course.course_name)}>
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="editModalLabel">Edit course name</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setCourseName(course.course_name)}></button>
                </div>
                <div class="modal-body">
                    <input type="text" className="form-control" value={courseName} onChange={e => setCourseName(e.target.value)}></input>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={() => setCourseName(course.course_name)}>Close</button>
                    <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onClick={e => updateCourse(e)}>Save changes</button>
                </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default EditCourse;