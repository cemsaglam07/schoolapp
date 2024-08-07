import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();

    const register = async (firstname, lastname, dateofbirth, email, phonenumber, password, role) => {
        setIsLoading(true);
        setError(null);

        const body = {
            first_name: firstname,
            last_name: lastname,
            date_of_birth: dateofbirth,
            email,
            phone_number: phonenumber,
            password
        };
        let response;
        if (role === 'student') {
            response = await fetch(`http://localhost:4000/api/student/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
        } else if (role === 'teacher') {
            response = await fetch(`http://localhost:4000/api/teacher/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
        }
        
        const json = await response.json();
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false);
        }
    }
    return {register, error, isLoading};
}