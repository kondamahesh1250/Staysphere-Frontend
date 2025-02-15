import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from "../Components/Loader";
import GoogleLogin from "../Screens/GoogleLogin"; 
import "../App.css";  


const Registerscreen = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
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

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    async function handleSubmit(e) {
        e.preventDefault();
        const { name, email, password, c_password } = formData;

        if (!name || !email || !password || !c_password) {
            toast.error("All fields are required!", { autoClose: 3000 });
            return;
        }

        if (password !== c_password) {
            toast.error("Passwords do not match!", { autoClose: 3000 });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${BASE_URL}/users/register`, formData);
            setLoading(false);

            if (data) {
                toast.success("Registration Successful! Please Login", { autoClose: 2000 });
                setTimeout(() => navigate("/login"), 2000);
            }
            setFormData({ name: "", email: "", password: "", c_password: "" });

        } catch (error) {
            console.log(error);
            setLoading(false);
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            } else {
                toast.error("Something went wrong! Please try again.", { autoClose: 3000 });
            }
        }
    }

    return (
        <>
            {loading && (<Loader />)}
            <div className="registercontainer">
                <div className='registerhome'>
                    <Link to={"/"} ><button><i class="fa-solid fa-house"></i> Home</button></Link>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="register-form">
                        <h1>Register Screen</h1>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="c_password">Confirm Password</label>
                            <input type="password" name="c_password" id="c_password" value={formData.c_password} onChange={handleChange} />
                        </div>
                        <button type="submit" className="registerbtn">Register</button>
                    </form>
                </div>
                <div>
                    <GoogleLogin name="Sign up with Google" />
                </div>
            </div>

        </>
    );
};

export default Registerscreen;
