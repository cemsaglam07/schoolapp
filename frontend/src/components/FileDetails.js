import { useFilesContext } from '../hooks/useFilesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import EditFile from './EditFile';
import { Link } from 'react-router-dom';

const FileDetails = ({ file }) => {
    const { dispatch } = useFilesContext();
    const { user } = useAuthContext();

    const deleteFile = async () => {
        if (!user) {
            return
        }
        const response = await fetch(`http://localhost:4000/upload/${file.file_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json()
        if (response.ok) {
            dispatch({type: 'DELETE_FILE', payload: json})
        }
    }

    return (
        <div className="card" key={file.file_id}>
            <div className="card-body d-flex flex-row">
                <p className="card-title flex-grow-1">{file.name}</p>
                <p>{file.file_id}</p>
                <EditFile file={file} />
                <Link to={`/files/${file.path}`}>
                    <button className="btn btn-success">
                        Download
                    </button>
                </Link>
                <button className="btn btn-danger" onClick={() => deleteFile(file.file_id)}>Delete</button>
            </div>
        </div>
    );
}

export default FileDetails;