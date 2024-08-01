import { useAuthContext } from "./useAuthContext";
import { useCoursesContext } from "./useCoursesContext";

export const useLogout = () => {
    const {dispatch} = useAuthContext();
    const {dispatch: dispatchCourses } = useCoursesContext();

    const logout = () => {
        localStorage.removeItem('user');
        dispatch({type: 'LOGOUT'});
        dispatchCourses({type: 'SET_COURSES', payload: null});
    }
    
    return {logout};
}