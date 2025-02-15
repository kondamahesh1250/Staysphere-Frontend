import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import axios from "axios";

const GoogleLogin = ({ name }) => {
    const navigate = useNavigate();

    // Prevent logged-in users from accessing the login page
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role"); // Get stored role

        if (token && role) {
            navigate(role === "admin" ? "/admin" : "/homescreen", { replace: true });
        }
    }, [navigate]);

    const login = useGoogleLogin({
        flow: "auth-code",  // Redirect mode
        onSuccess: async (tokenResponse) => {
            try {
                const { code } = tokenResponse;
                const response = (await axios.post("/api/users/googlesign", { code })).data;

                localStorage.setItem("token", response);

                toast.success("Login Successful!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: () => fetchUserRole(response), // Redirect after toast closes
                });


            } catch (error) {
                console.error("Error during Google login:", error);
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

        },
        onError: (error) => console.error("Login Failed:", error),
    });

    async function fetchUserRole(token) {
        try {
            const response = await axios.get('/api/users/verifyuser', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userRole = response.data.isAdmin;
            localStorage.setItem("role", userRole ? "admin" : "user"); // Store role for persistence

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

    return (
        <div>
            <button style={{ backgroundColor: "white", color: "black", borderRadius: "5px" }} onClick={() => login()}>{name}
                <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                    alt="Google Logo"
                    width="20"
                    height="20"
                    style={{ marginLeft: "5px" }} />
            </button>
            <ToastContainer />
        </div>
    );
};

export default GoogleLogin;
