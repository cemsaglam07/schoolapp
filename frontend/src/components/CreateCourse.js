import React, {Fragment, useState} from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCoursesContext } from "../hooks/useCoursesContext";

const CreateCourse = () => {
    const {dispatch} = useCoursesContext();
    const {user} = useAuthContext();

    const [courseName, setCourseName] = useState("");
    const [error, setError] = useState(null)
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in");
            return;
        }
        const body = { course_name: courseName };
        const response = await fetch("http://localhost:4000/api/course", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(body)
        })
        const json = await response.json();
        
        if (!response.ok) {
            setError(json.error);
        }
        if (response.ok) {
            setCourseName("");
            setError(null);
            dispatch({type: 'CREATE_COURSE', payload: json});
        }
    }

    return (
        <Fragment>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={courseName} onChange={e => setCourseName(e.target.value)} />
                <button className="btn btn-success">Create course</button>
            </form>
            {error && <div className="alert alert-danger mt-3 mb-3" role="alert">{error}</div>}
        </Fragment>
    );
}

export default CreateCourse;