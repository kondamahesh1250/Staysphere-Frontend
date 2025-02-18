import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import { motion } from "framer-motion";
import "../App.css";
import { toast } from "react-toastify";

const Room = ({ room, fromDate, toDate }) => {
  const navigate = useNavigate();

  const handleUser = () => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage: ", token); // Debugging log
    
    if (!token) {
      console.log("No token found. Redirecting to login...");
      // Store the intended URL before redirecting to login
      sessionStorage.setItem("redirectAfterLogin", `/book/${room._id}/${fromDate}/${toDate}`);
      toast.warning("Not logged in. Please login to book a room.",{autoClose:1500});
      navigate("/login"); // Redirect to login
    } else {
      console.log("Token found. Proceeding with booking...");
      navigate(`/book/${room._id}/${fromDate}/${toDate}`); // Proceed with booking
    }
  };
   
  return (
    <motion.div
      className="roomcontainer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }} // Smooth exit animation when filtering
      transition={{ duration: 0.8, ease: "easeOut" }}
      layout // Ensures smooth layout transition when list updates
    >
      <div className="roomimage">
        <img src={room.imageurls[0]} alt="" loading="lazy" />
      </div>
      <div className="roominfo">
        <h1>{room.name}</h1>
        <p style={{ fontSize: "18px" }}>
          {Object.keys(room.features)
            .filter((key) => room.features[key])
            .map((key) => key.replace(/_/g, " "))
            .join(", ")}
        </p>
        <p>Max Count: {room.maxcount}</p>
        <p>Phone Number: {room.phonenumber}</p>
        <p>Type: {room.type}</p><br />

        <div className="btncontainer">
          {fromDate && toDate && (
            // <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
              <button className="bookbtn" onClick={handleUser}>Book Now</button>
            /* </Link> */
          )}
          <Link to={`/viewroom/${room._id}`}>
            <button className="viewbtn">View Details</button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Room;
