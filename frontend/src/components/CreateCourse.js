import React, {Fragment, useState} from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const CreateCourse = () => {
    const [courseName, setCourseName] = useState("");
    const {user} = useAuthContext();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }
        try {
            const body = { course_name: courseName };
            const response = await fetch("http://localhost:4000/api/course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(body)
            })
            window.location = "/";
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <h1 className="text-center mt-5">Course</h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={courseName} onChange={e => setCourseName(e.target.value)} />
                <button className="btn btn-success">Create course</button>
            </form>
        </Fragment>
    );
}

export default CreateCourse;