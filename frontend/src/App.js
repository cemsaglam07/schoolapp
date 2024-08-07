import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Courses from "./pages/Courses";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import TeacherLogin from './pages/TeacherLogin';
import TeacherRegister from './pages/TeacherRegister';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
    const { user } = useAuthContext();

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route index element={user ? <Home /> : <Navigate to="/login"/> } />
                <Route path="courses" element={user ? <Courses /> : <Navigate to="/login"/> } />
                <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />
                <Route path="teacher/login" element={!user ? <TeacherLogin /> : <Navigate to="/" />} />
                <Route path="teacher/register" element={!user ? <TeacherRegister /> : <Navigate to="/" />} />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
