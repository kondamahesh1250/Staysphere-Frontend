import React from 'react';
import "../App.css"
import { Link } from "react-router-dom";

const Room = ({ room, fromDate, toDate }) => {

  return (
    <div className='roomcontainer'>
      <div className='roomimage'>
        <img src={room.imageurls[0]} alt='' />
      </div>
      <div className='roominfo'>
        <h1>{room.name}</h1>
        <p style={{ fontSize: "18px" }}>
          {Object.keys(room.features)
            .filter((key) => room.features[key]) // Only show features that are available
            .map((key) => key.replace(/_/g, " ")) // Replace underscores with spaces
            .join(", ")}
        </p>
        <p>Max Count: {room.maxcount}</p>
        <p>Phone Number: {room.phonenumber}</p>
        <p>Type: {room.type}</p><br />

        <div className='btncontainer'>
          {(fromDate && toDate) && (
            <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
              <button className='bookbtn'>Book Now</button>
            </Link>
          )}
          <Link to={`/viewroom/${room._id}`}>
            <button className='viewbtn'>View Details</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Room;