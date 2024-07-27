import React, {useState} from "react";

const Register = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [dateofbirth, setDateOfBirth] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const body = {
                first_name: firstname,
                last_name: lastname,
                date_of_birth: dateofbirth,
                email,
                phone_number: phonenumber,
                password
            };
            const response = await fetch(`http://localhost:4000/api/student/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            if (response.ok && response.status === 200) {
                setRegister(true);
            }
        } catch (err) {
            console.error(err.message);
        }
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
        <button type="submit" className="btn btn-primary" onClick={e => submitForm(e)}>Submit</button>
        </form>
        {register ? (
          <p className="text-success">You Are Registered Successfully</p>
        ) : (
          <p className="text-danger">You Are Not Registered</p>
        )}
        </>
    );
};
  
export default Register;