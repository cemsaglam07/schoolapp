import { FilesContext } from "../context/FileContext";
import { useContext } from "react";

export const useFilesContext = () => {
    const context = useContext(FilesContext);
    if (!context) {
        throw new Error('FileContext must be used inside a FileContextProvider');
    }

    return context;
}