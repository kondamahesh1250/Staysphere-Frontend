import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import axios from "axios";

const GoogleLogin = ({ name }) => {

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const navigate = useNavigate();

    const login = useGoogleLogin({
        flow: "auth-code",  // Redirect mode
        onSuccess: async (tokenResponse) => {
            try {
                const { code } = tokenResponse;
                const { data } = await axios.post(`${BASE_URL}/users/googlesign`, { code });

                if (data) {
                    localStorage.setItem("token", data);
                    toast.success("Login Successful!", {
                        autoClose: 2000,
                        onClose: () => fetchUserRole(data)
                    });
                }
            } catch (error) {
                console.error("Error during Google login:", error);
                if (error.response) {
                    toast.error(error.response?.status === 400 ? "Invalid Credentials!" : "Something went wrong. Please try again!", { autoClose: 2000 });
                }
            }
        },
        onError: (error) => console.error("Login Failed:", error),
    });

    async function fetchUserRole(token) {
        try {
            const response = await axios.get(`${BASE_URL}/users/verifyuser`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userRole = response.data.isAdmin;
            navigate(userRole ? "/admin" : "/homescreen", { replace: true });

            // Prevent navigating back to login page
            window.history.pushState(null, "", window.location.href);
            window.onpopstate = () => {
                window.history.pushState(null, "", window.location.href);
            };

        } catch (error) {
            console.log(error);
            localStorage.removeItem("token");
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
        </div>
    );
};

export default GoogleLogin;
