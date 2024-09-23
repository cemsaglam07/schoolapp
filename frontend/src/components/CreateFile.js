import axios from 'axios';
import React, {Fragment, useState} from "react";
import {useParams} from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFilesContext } from "../hooks/useFilesContext";

const CreateFile = () => {
    const {id} = useParams();
    const {dispatch} = useFilesContext();
    const {user} = useAuthContext();

    const [file, setFile] = useState([]);
    const [error, setError] = useState(null);
    
    const upload = async () => {
        if (!user) {
            setError("You must be logged in");
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`http://localhost:4000/upload/${id}`, formData).catch(err => console.log(err));
        const json = response.data;
        console.log("json create file: ", json);
        if (response.status !== 200) { // response.ok
            setError(response.statusText);
        }
        if (response.status === 200) { // response.ok
            setFile([]);
            setError(null);
            dispatch({type: 'CREATE_FILE', payload: json});
        }
    }

    return (
        <Fragment>
            <form action="/upload" encType="multipart/form-data">
                <div className="input-group mb-3">
                    <input type="file" className="form-control" id="upload" onChange={(e) => setFile(e.target.files[0])}  />
                    <button className="btn btn-outline-secondary" type="button" onClick={upload}>Upload</button>
                </div>
            </form>
            {error && <div className="alert alert-danger mt-3 mb-3" role="alert">{error}</div>}
        </Fragment>
    );
}

export default CreateFile;