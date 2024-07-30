import { Outlet, Link } from "react-router-dom";
import {useLogout} from '../hooks/useLogout';
import { useAuthContext } from "../hooks/useAuthContext";

const Layout = () => {
    const {logout} = useLogout();
    const {user} = useAuthContext();

    const handleClick = () => {
        logout();
    }

    return (
        <>
        <nav>
            <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            {!user && (
                <>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                </>
            )}
            {user && (
                <li>
                    <span>{user.email}</span>
                    <button onClick={handleClick}>Logout</button>
                </li>
            )}
            </ul>
        </nav>

        <Outlet />
        </>
  )
};

export default Layout;