import React, { Fragment, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFilesContext } from "../hooks/useFilesContext";

const EditFile = ({file}) => {
    const {user} = useAuthContext();
    const {dispatch} = useFilesContext();

    const [filename, setFilename] = useState(file.name);
    
    const updateFile = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }
        try {
            const body = {filename: filename, method: "nameChange"};
            const response = await fetch(`http://localhost:4000/upload/${file.file_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(body)
            })
            const json = await response.json();
            dispatch({type: 'EDIT_FILE_NAME', payload: json});
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <>
            <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target={`#id${file.file_id}`}>
            Edit
            </button>

            <div className="modal fade" id={`id${file.file_id}`} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true" onClick={() => setFilename(file.name)}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="editModalLabel">Edit file name</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setFilename(file.name)}></button>
                </div>
                <div className="modal-body">
                    <input type="text" className="form-control" value={filename} onChange={e => setFilename(e.target.value)}></input>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => setFilename(file.name)}>Close</button>
                    <button type="button" className="btn btn-warning" data-bs-dismiss="modal" onClick={e => updateFile(e)}>Save changes</button>
                </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default EditFile;