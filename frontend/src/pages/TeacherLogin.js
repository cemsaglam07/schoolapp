import React, {useState} from "react";
import { useLogin } from "../hooks/useLogin";

const TeacherLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login, error, isLoading} = useLogin();
    

    const submitForm = async (e) => {
        e.preventDefault()
        await login(email, password, "teacher")
    }

    return (
        <>
        <h2>Login</h2>
        <form>
        <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">Email address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="inputEmail" />
        </div>
        <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="inputPassword" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={e => submitForm(e)} disabled={isLoading}>Submit</button>
        {error && <div className="alert alert-danger mt-3 mb-3" role="alert">{error}</div>}
        </form>
        </>
    );
};
  
export default TeacherLogin;