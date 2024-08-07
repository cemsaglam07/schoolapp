import React, {useState} from "react";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [dateofbirth, setDateOfBirth] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {register, error, isLoading} = useRegister();

    const submitForm = async (e) => {
        e.preventDefault();
        
        await register(firstname, lastname, dateofbirth, email, phonenumber, password, "teacher");
    }

    return (
        <>
        <h2>Register</h2>
        <form>
        <div className="row mb-3">
            <div className="col">
                <input type="text" className="form-control" value={firstname} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" aria-label="First name" />
            </div>
            <div className="col">
                <input type="text" className="form-control" value={lastname} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" aria-label="Last name" />
            </div>
        </div>
        <div className="row mb-3">
            <div className="col">
                <input type="text" className="form-control" placeholder="Date of birth" value={dateofbirth} onChange={(e) => setDateOfBirth(e.target.value)}/>
            </div>
            <div className="col">
                <input type="text" className="form-control" placeholder="Phone number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col">
                <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} id="inputEmail" />
            </div>
            <div className="col">
                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} id="inputPassword" />
            </div>
        </div>
        <button type="submit" className="btn btn-primary" onClick={e => submitForm(e)} disabled={isLoading}>Submit</button>
        {error && <div className="alert alert-danger mt-3 mb-3" role="alert">{error}</div>}
        </form>
        </>
    );
};
  
export default Register;