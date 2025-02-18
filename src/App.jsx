import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from './Components/Navbar.jsx';
import Landingpage from './Components/Landingpage.jsx';
import Homescreen from "./Screens/Homescreen.jsx";
import Roomdetails from './Screens/Roomdetails.jsx';
import Bookingscreen from './Screens/Bookingscreen.jsx';
import Loginscreen from './Screens/Loginscreen.jsx';
import Registerscreen from './Screens/Registerscreen.jsx';
import Profilescreen from './Screens/Profilescreen.jsx';
import Adminscreen from './Screens/Adminscreen.jsx';
import 'antd/dist/reset.css';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
    };

    const logoutUser = () => {
      toast.warning("You have been logged out due to inactivity.", { autoClose: 2000 });
    
      localStorage.removeItem("token");
      
      // Dispatch an event to notify other components
      window.dispatchEvent(new Event("authChange"));
    
      navigate("/login");
      // window.location.reload(); // Only needed if Navbar still doesn't update
    };
    

    // Check if the token is expired
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            toast.error("Session Expired! Please log in again.", { autoClose: 2000 });

            setTimeout(() => {
              localStorage.removeItem("token");
              navigate("/login");
            }, 1000);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          navigate("/login");
        }
      }
    };

    // Event listeners for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    // Check token expiry on app load
    checkTokenExpiry();
    resetTimer();

    // Check token expiry every minute
    const tokenCheckInterval = setInterval(checkTokenExpiry, 1 * 60 * 1000); // 1 minute

    return () => {
      clearTimeout(timeout);
      clearInterval(tokenCheckInterval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [navigate]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/homescreen" element={<Homescreen />} />
        <Route path="/viewroom/:id" element={<Roomdetails />} />
        <Route path="/book/:id/:fromDate/:toDate" element={<Bookingscreen />} />
        <Route path="/register" element={<Registerscreen />} />
        <Route path="/login" element={<Loginscreen />} />
        <Route path="/profile" element={<Profilescreen />} />
        <Route path="/admin" element={<Adminscreen />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
