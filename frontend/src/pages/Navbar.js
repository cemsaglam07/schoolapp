import { Link } from "react-router-dom";
import {useLogout} from '../hooks/useLogout';
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const {logout} = useLogout();
    const {user} = useAuthContext();

    const handleClick = () => {
        logout();
    }

    return (
        <nav className="navbar navbar-expand-sm">
            <div className="container-fluid">
            <ul className="navbar-nav">
            <li className="nav-item mx-3">
                <Link to="/courses">Courses</Link>
            </li>
            </ul>
            {!user && (
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item mx-3">
                        <Link to="/login">Login</Link>
                    </li>
                    <li className="nav-item mx-3">
                        <Link to="/register">Register</Link>
                    </li>
                </ul>
            )}
            {user && (
                <ul className="navbar-nav mx-3 ms-auto">
                    <li className="nav-item">
                        <span>{user.email}</span>
                        <button onClick={handleClick}>Logout</button>
                    </li>
                </ul>
            )}
            
            </div>
        </nav>
    )
};

export default Navbar;