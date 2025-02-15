import React, { useState } from "react";
import "../App.css"
import axios from "axios";
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';
import Success from "../Components/Success";
import { Link } from "react-router-dom";
import GoogleLogin from "./GoogleLogin";

const Registerscreen = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [message,setMessage] = useState()

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { name, email, password, c_password } = formData;

        if (!name || !email || !password || !c_password) {
            alert("All fields are required!");
            return;
        }

        if (password !== c_password) {
            alert("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const result = (await axios.post('/api/users/register', formData)).data;
            setLoading(false);

            console.log(result)
            if (result.status==400) {
                setSuccess(true);
                setMessage(result.message)
            } else {
                setSuccess(true);
                setMessage(result.message)
                window.location.href = "/login";
            }
            setFormData({ name: "", email: "", password: "", c_password: "" });

        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
        }
    }

    return (
        <>
            {loading && (<Loader />)}
            {error && (<Failure />)}
            <div className="registercontainer">
                <div className='registerhome'>
                    <Link to={"/"} ><button><i class="fa-solid fa-house"></i> Home</button></Link>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit">Register</button>
                        <div style={{justifyContent:"center"}}>
                            {success && (<Success message={message} />)}
                        </div>
                    </form>
                </div>
                <div>
                    <GoogleLogin name="Sign up with Google"/>
                </div>
            </div>

        </>
    );
};

export default Registerscreen;
