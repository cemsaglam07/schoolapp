import { useCoursesContext } from '../hooks/useCoursesContext';
import { useAuthContext } from '../hooks/useAuthContext';

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
        <div className="card" key={course.course_id}>
        <div className="card-body">
            <h5 className="card-title">{course.course_name}</h5>
            <button className="btn btn-danger" onClick={deleteCourse}>Delete</button>
        </div>
        </div>
    );
}

export default CourseDetails;