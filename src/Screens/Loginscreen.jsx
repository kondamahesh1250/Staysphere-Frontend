import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from '../Components/Loader';
import "../App.css"

const Loginscreen = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    // useEffect(() => {
    //     const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    //     if (redirectPath) {
    //       sessionStorage.removeItem("redirectAfterLogin"); // Clear it after using
    //       navigate(redirectPath);
    //     } else {
    //       navigate("/homescreen"); // Default fallback
    //     }
    //   }, []);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    async function handleSubmit(e) {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            toast.error("All fields are required!", { autoClose: 3000 });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${BASE_URL}/users/login`, formData);
            setLoading(false);

            if (data.token) {
                localStorage.setItem("token", data.token);
                fetchUserRole(data.token); // Call immediately
                toast.success("Login Successful!", { autoClose: 1500 });
            }



        } catch (error) {
            setLoading(false);
            if (error.response) {
                toast.error(error.response?.status === 400 ? "Invalid Credentials!" : "Something went wrong. Please try again!", { autoClose: 2000 });
            }
        }
    }

    async function fetchUserRole(token) {
        try {
            const response = await axios.get(`${BASE_URL}/users/verifyuser`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userRole = response.data;
            if (userRole) {
                setFormData({ email: "", password: "" });
                navigate(userRole.isAdmin ? "/admin" : "/homescreen", { replace: true });
                window.dispatchEvent(new Event("authChange")); // Notify Navbar

                const redirectPath = sessionStorage.getItem("redirectAfterLogin");
                if (redirectPath) {
                    sessionStorage.removeItem("redirectAfterLogin"); // Clear it after using
                    return navigate(redirectPath, { replace: true });
                } else {
                    navigate("/homescreen");
                }

                // Prevent navigating back to login page
                window.history.pushState(null, "", window.location.href);
                window.onpopstate = () => {
                    window.history.pushState(null, "", window.location.href);
                };
            }
        } catch (error) {
            console.log(error);
            localStorage.removeItem("token");
        }
    }

    function handleGuest() {
        const guestLogin = {
            name: "Guest User",
            email: "guestuser@gmail.com",
            password: "guest"
        }

        localStorage.setItem("guestUser", JSON.stringify(guestLogin));
        window.dispatchEvent(new Event("authChange"));

        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
            sessionStorage.removeItem("redirectAfterLogin"); // Clear it after using
            return navigate(redirectPath, { replace: true });
        } else {
            navigate("/homescreen"); // Default fallback
        }

        toast.success(" Welcome, Guest User!", { autoClose: 2000 });
        navigate("/homescreen", { replace: true });

    }

    return (
        <>
            {loading && <Loader />}
                <div className='loginhome'>
                    <Link to={"/"}><button><i className="fa-solid fa-house"></i> Home</button></Link>
                </div>
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1 className="form-title">Login Screen</h1>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
                        <label for="email">Email address</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                        <label for="password">Password</label>
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="form-input" />
                    </div> */}
                    <button type="submit" className="form-button">Login</button>
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
