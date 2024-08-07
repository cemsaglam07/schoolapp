import { useCoursesContext } from '../hooks/useCoursesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import EditCourse from './EditCourse';

const CourseDetails = ({ course }) => {
    const { dispatch } = useCoursesContext()
    const { user } = useAuthContext()

    const deleteCourse = async () => {
        if (!user) {
            return
        }
        const response = await fetch(`http://localhost:4000/api/course/${course.course_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if (response.ok) {
            dispatch({type: 'DELETE_COURSE', payload: json})
        }
    }

    return (
        <div className="card my-3" key={course.course_id}>
        <div className="card-body d-flex flex-row">
            <h5 className="card-title flex-grow-1">{course.course_name}</h5>
            {user.role === 'teacher' && (
                <>
                <EditCourse course={course}/>
                <button className="btn btn-danger" onClick={deleteCourse}>Delete</button>
                </>
            )}
        </div>
        </div>
    );
}

export default CourseDetails;