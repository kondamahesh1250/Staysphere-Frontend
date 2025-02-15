import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RoomCard = ({ room, fromDate, toDate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(`room-${room._id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [room._id]);

  return (
    <motion.div
      id={`room-${room._id}`}
      className="roomcontainer"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="roomimage">
        <img src={room.imageurls[0]} alt="" />
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
            <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
              <button className="bookbtn">Book Now</button>
            </Link>
          )}
          <Link to={`/viewroom/${room._id}`}>
            <button className="viewbtn">View Details</button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
