import { createContext, useReducer } from 'react'

export const FilesContext = createContext()

export const filesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILES': 
      return {
        files: action.payload
      }
    case 'CREATE_FILE':
      return {
        files: [action.payload, ...state.files]
      }
    case 'EDIT_FILE_NAME':
      return {
        files: state.files.map((f) =>
          f.file_id === action.payload.file_id
            ? { ...f, name: action.payload.name }
            : f
        )
      }
    case 'EDIT_FILE_VISIBILITY':
      return {
        files: state.files.map((f) =>
          f.file_id === action.payload.file_id
            ? { ...f, visible: action.payload.visible }
            : f
        )
      }
    case 'DELETE_FILE':
      return {
        files: state.files.filter((f) => f.file_id !== action.payload.file_id)
      }
    default:
      return state
  }
}

export const FilesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filesReducer, {
    files: null
  })

  return (
    <FilesContext.Provider value={{...state, dispatch}}>
      { children }
    </FilesContext.Provider>
  )
}