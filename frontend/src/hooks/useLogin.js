import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password, role) => {
        setIsLoading(true);
        setError(null);

        console.log("role:", role);
        let response;
        if (role === 'student') {
            response = await fetch('http://localhost:4000/api/student/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            })
        } else if (role === 'teacher') {
            response = await fetch('http://localhost:4000/api/teacher/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            })
        }
        
        const json = await response.json();
        console.log("json:", json);
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type: 'LOGIN', payload: json});
            setIsLoading(false);
        }
    }

    return { login, isLoading, error };
}