import { useEffect } from 'react';
import { useCoursesContext } from "../hooks/useCoursesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CourseDetails from '../components/CourseDetails';
import CreateCourse from '../components/CreateCourse';

const Courses = () => {
    const {courses, dispatch} = useCoursesContext();
    const {user} = useAuthContext();

    useEffect(() => {
        const getCourses = async () => {
            const response = await fetch('http://localhost:4000/api/course/', {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const json = await response.json();
            if (response.ok) {
                dispatch({type: 'SET_COURSES', payload: json});
            }
        }

        if (user) {
            getCourses();
        }
    }, [dispatch, user])

    return (
        <div className="home mx-5">
            <CreateCourse />
            <div className="courses">
                {courses && courses.map((course) => (
                    <CourseDetails key={course.course_id} course={course} />
                ))}
            </div>
        </div>
    );
};
  
export default Courses;