import React, {useState} from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const body = {email, password};
            const response = await fetch(`http://localhost:4000/api/student/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            if (response.ok && response.status === 200) {
                setLogin(true);
                cookies.set("TOKEN", result.data.token, {
                    path: "/",
                });
            }
        } catch (err) {
            console.error(err.message);
        }
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
        <button type="submit" className="btn btn-primary" onClick={e => submitForm(e)}>Submit</button>
        </form>
        {login ? (
          <p className="text-success">You Are Logged in Successfully</p>
        ) : (
          <p className="text-danger">You Are Not Logged in</p>
        )}
        </>
    );
};
  
export default Login;