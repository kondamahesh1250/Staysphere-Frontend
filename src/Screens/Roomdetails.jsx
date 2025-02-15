import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Point of icon which corresponds to marker's location
    popupAnchor: [1, -34] // Point from which the popup should open
});

const Roomdetails = () => {

    const { id } = useParams();

    const [rooms, setRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {

        const fetchRooms = async () => {
            try {
                setLoading(true);
                const data = (await axios.post(`${BASE_URL}/rooms/getroombyid`, { roomid: id })).data;
                setRooms(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setLoading(false);
                setError(true);
            }
        };
        fetchRooms();
    }, [id]);


    const imageurls = rooms?.imageurls || [];

    const [position, setPosition] = useState([12.9716, 77.5946]); 

    useEffect(() => {
        if (rooms?.location?.lat && rooms?.location?.lng) {
            setPosition([rooms.location.lat, rooms.location.lng]);
        }
    }, [rooms]);



     if (error) {
        return <Failure message={"Error fetching data!"} />;
    }

    return (      
        <div className="caromain">
            <div className='caroinfo'>
                {loading && <Loader />}
                {rooms && (
                    <>
                        <h2 style={{ fontSize: "35px", fontWeight: "bold" }}>Room Details</h2><br />
                        <div className="caroimg">
                            <Carousel>
                                {imageurls?.map((ele, ind) => (
                                    <Carousel.Item key={ind}>
                                        <img
                                            className="d-block w-100 bigimg"
                                            src={ele}
                                            alt=""
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                    </>
                )}
            </div>
            <div className="roomdetails">
                <div className='roomleft'>
                    <p style={{ fontSize: "25px", fontWeight: "bold" }}>{rooms?.name}</p>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>{rooms?.description}</p>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>Room Type: {rooms?.type}</p>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>Room Price: {rooms?.rentperday}</p>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>Facilities:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {rooms?.features && Object.keys(rooms.features).length > 0
                            ? Object.keys(rooms.features)
                                .filter((key) => rooms.features[key]) // Only show available features
                                .map((key) => (
                                    <span
                                        key={key}
                                        style={{
                                            backgroundColor: "#f0f0f0",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            border: "1px solid #ccc",
                                        }}
                                    >
                                        {key.replace(/_/g, " ")}
                                    </span>
                                ))
                            : "No features available"}
                    </div>
                </div>
                <div className='roomright'>
                    <h2>Location</h2>
                    <MapContainer key={position.toString()} center={position} zoom={13} style={{ height: "300px", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                        <Marker position={position} icon={customIcon}>
                            <Popup>Hotel Location</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div >
    )
}

export default Roomdetails;