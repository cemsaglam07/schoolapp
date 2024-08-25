import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios';

const FileDownload = () => {
    const {filename} = useParams();
    const [text, setText] = useState("File is downloading...");

    useEffect(() => {
        const downloadFile = () => {
            axios({
                url: `http://localhost:4000/files/${filename}`,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }).catch((error) => {
                console.error('Error during file download', error);
                setText(error.message);
            });
        };

        downloadFile();
    }, [filename]);

    return (
        <div className="App">
            <p className="text-center fw-bold">{text}</p>
        </div>
    );
}

export default FileDownload;