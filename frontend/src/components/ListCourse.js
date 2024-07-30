import React, {Fragment, useState, useEffect} from "react";
import EditCourse from "./EditCourse";
import {useAuthContext} from "../hooks/useAuthContext";

const ListCourse = () => {
    const [courses, setCourses] = useState([]);
    const {user} = useAuthContext();

    const getCourses = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/course/", {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const jsonData = await response.json();
            setCourses(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteCourse = async (id) => {
        try {
            const deleteCourse = await fetch(`http://localhost:4000/api/course/${id}`, {
                method: "DELETE",
                headers: {'Authorization': `Bearer ${user.token}`}
            });
            setCourses(courses.filter(course => course.course_id !== id));
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        if (user) {
            getCourses();
        }
    }, [user]);

    return (
        <Fragment>
            {courses.map(course => (
                <div className="card" key={course.course_id}>
                <div className="card-body">
                  <h5 className="card-title">{course.course_name}</h5>
                  <EditCourse course={course}/>
                  <button className="btn btn-danger" onClick={() => deleteCourse(course.course_id)}>Delete</button>
                </div>
              </div>
            ))}
        </Fragment>
    )
}

export default ListCourse;