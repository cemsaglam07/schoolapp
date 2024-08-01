import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import { useAuthContext } from './hooks/useAuthContext';

function App() {
    const { user } = useAuthContext();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={user ? <Home /> : <Navigate to="/login"/> } />
                    <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
