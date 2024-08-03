import { createContext, useReducer } from 'react'

export const CoursesContext = createContext()

export const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES': 
      return {
        courses: action.payload
      }
    case 'CREATE_COURSE':
      return {
        courses: [action.payload, ...state.courses]
      }
    case 'EDIT_COURSE_NAME':
      return {
        courses: state.courses.map((c) =>
          c.course_id === action.payload.course_id
            ? { ...c, course_name: action.payload.course_name }
            : c
        )
      }
    case 'DELETE_COURSE':
      return {
        courses: state.courses.filter((c) => c.course_id !== action.payload.course_id)
      }
    default:
      return state
  }
}

export const CoursesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(coursesReducer, {
    courses: null
  })

  return (
    <CoursesContext.Provider value={{...state, dispatch}}>
      { children }
    </CoursesContext.Provider>
  )
}