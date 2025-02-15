import React, { useState, useEffect } from "react";
import "../App.css"
import axios from "axios";
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Loginscreen = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role"); // Get stored role

        if (token && role) {
            navigate(role === "admin" ? "/admin" : "/homescreen", { replace: true });
        }

        console.log(role)

    }, [navigate]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            toast.error("All fields are required!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/users/login', formData);
            setLoading(false);

            localStorage.setItem("token", response.data.token);

            toast.success("Login Successful!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: () => fetchUserRole(response.data.token), // Redirect after toast closes
            });


        } catch (error) {
            setLoading(false);
            setError(true);

            if (error.response) {
                toast.error(error.response?.status === 400 ? "Invalid Credentials!" : "Something went wrong. Please try again!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    }

    async function fetchUserRole(token) {
        try {
            const response = await axios.get('/api/users/verifyuser', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userRole = response.data.isAdmin;
            console.log(userRole);

            localStorage.setItem("role", userRole ? "admin" : "user"); // Store role for persistence

            setFormData({ email: "", password: "" });

            navigate(userRole ? "/admin" : "/homescreen", { replace: true });

             // Prevent navigating back to login page
             window.history.pushState(null, "", window.location.href);
             window.onpopstate = () => {
                 window.history.pushState(null, "", window.location.href);
             };
        } catch (error) {
            console.log(error);
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }
    }

    function handleGuest() {
        const guestLogin = {
            name: "Guest User",
            email: "guestuser@gmail.com",
            password: "guest"
        }

        localStorage.setItem("guestUser", JSON.stringify(guestLogin));
        navigate("/homescreen", { replace: true });
    }




    return (
        <>
            {loading && <Loader />}
            <div className="login-container">
                <div className='loginhome'>
                    <Link to={"/"}><button><i className="fa-solid fa-house"></i> Home</button></Link>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <h1 className="form-title">Login Screen</h1>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-button">Login</button>
                    <ToastContainer />
                </form>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <button className="form-button" style={{ backgroundColor: "white", color: "black", borderRadius: "5px" }} onClick={handleGuest}>Continue as Guest
                        <img src="https://t3.ftcdn.net/jpg/06/03/30/74/360_F_603307418_jya3zntHWjXWn3WHn7FOpjFevXwnVP52.jpg" style={{ width: "30px" }} alt="" />
                    </button>
                    <br />
                    <p>Don't have an account? <Link to={"/register"}>Sign up</Link></p>
                </div>
            </div>
        </>
    );
};

export default Loginscreen;
