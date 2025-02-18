import React, { useEffect, useState } from 'react'
import { Tabs, ConfigProvider, Tag } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';



const Profilescreen = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatePassword, setUpdatePassword] = useState("");;

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = (user) => {
        setShow(true);
        setSelectedUser(user);
    };

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setUpdatePassword((prev) => (
            { ...prev, [name]: value }
        ));
    }

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handlePasswordChange = async () => {
        const { password, c_password } = updatePassword;

        if (!updatePassword && !selectedUser) {
            toast.error("please select user to update", { autoClose: 2000 });
            return;
        }

        if (password !== c_password) {
            toast.error("Password and confirm password should be same", { autoClose: 2000 });
            setShow(true);
            return;
        }

        try {
            const { data } = await axios.post(`${BASE_URL}/users/updatepassword/${selectedUser._id}`, updatePassword);
            console.log(data);
            if (data.status === 200) {
                Swal.fire("Success", "Password Updated Successfully", "success");
            }
            setShow(false);
            setUpdatePassword("");
            setSelectedUser(null);
        } catch (error) {
            console.log(error);
            Swal.fire("Oops", "something went wrong", "Please try again");
        }
    }

    useEffect(() => {

        const isGuest = JSON.parse(localStorage.getItem("guestUser"));
        if (isGuest) {
            setUser(isGuest);
            return;
        }

        if (!token) {
            navigate("/login");
            return;
        }

        fetchUser(token);

    }, [token, navigate]);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/users/verifyuser`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response?.data);

        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("token"); 
            localStorage.removeItem("guestUser");
            setToken(null);
        }
    };

    const items = [
        {
            key: '1',
            label: 'Profile',
            children: (
                <div className="profile-container">
                    <h2 className="profile-heading">Profile Section</h2>
                    <h4 className="profile-detail">Name: {user?.name}</h4>
                    <h4 className="profile-detail">Email: {user?.email}</h4>
                    <h4 className="profile-detail">isAdmin: {user?.isAdmin ? 'Yes' : 'No'}</h4>
                    <h4 className='profile-detail'>Change Password: <span style={{ textDecoration: "underline", color: "blue" }} onClick={() => handleShow(user)}>Click Here</span></h4>


                    {/* Update Password Modal */}
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header>
                            <Modal.Title>Change Password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedUser && (
                                // <form >
                                <div className='d-flex flex-column'>
                                    <label>Password</label>
                                    <input type="text" name="password" onChange={handleUpdate} /><br />
                                    <label>Confirm Password</label>
                                    <input type="text" name="c_password" onChange={handleUpdate} />
                                </div>
                                // </form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button variant="danger" onClick={handlePasswordChange}>Update</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        },
        {
            key: '2',
            label: 'Bookings',
            children: (
                <div style={{ textAlign: "center" }}>
                    <h3>My Bookings</h3>
                    <MyBookings user={user} />
                </div>
            )
        }
    ];

    return (
        <div>
            <ConfigProvider
                theme={{
                    components: {
                        Tabs: {
                            itemColor: "black",
                            itemActiveColor: "black", 
                            inkBarColor: "#d9d9d9",
                            itemHoverColor: "#d9d9d9",
                            itemSelectedColor: "black",
                        },
                    },
                }}
            >
                <Tabs defaultActiveKey="1" items={items} style={{ margin: "10px" }} />
            </ConfigProvider>
        </div >
    );
};

export default Profilescreen;



export function MyBookings({ user }) {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {

        async function getBookings() {
            try {
                setLoading(true);
                const rooms = (await axios.post(`${BASE_URL}/bookings/getbookingsbyuserid`, { userid: user?._id })).data;
                setBookings(rooms);
                setLoading(false);

            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error)
            }
        }

        getBookings();

    }, []);


    async function cancelBooking(bookingid, roomid) {
        try {
            setLoading(true);
            const { data } = await axios.post("/bookings/cancelbooking", { bookingid, roomid })
            setLoading(false);
            if (data) {
                Swal.fire('Request Sent', 'Your booking has been cancelled', 'success');
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking._id === bookingid ? { ...booking, status: 'cancelled' } : booking
                    )
                );
            }
        } catch (error) {
            console.log(error);
            setError(true)
            Swal.fire('Opps ', 'Something went wrong', 'error');
        }

    }

    const convertToIST = (utcTime) => {
        const utcDate = new Date(utcTime);
        return utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    };

    return (
        <div>
            {loading && (<Loader />)}

            {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (

                    <div key={booking._id} className='profilebooking'>

                        <h4>{booking.room}</h4>
                        <p><b>BookingId</b>: {booking._id}</p>
                        <p><b>CheckIn</b>: {booking.fromStartDate}</p>
                        <p><b>CheckOut</b>: {booking.toEndDate}</p>
                        <p><b>Amount</b>: {booking.totalAmount}</p>
                        <p><b>Booked Details</b>: {convertToIST(booking.createdAt)}</p>
                        <p><b>Status</b>: {booking.status === 'cancelled' ? (<Tag color='red'>CANCELLED</Tag>) : (<Tag color='green'>CONFIRMED</Tag>)}</p>
                        {booking.status !== 'cancelled' && (
                            <div className='cancelbtn'>
                                <button onClick={() => cancelBooking(booking._id, booking.roomid)}>CANCEL BOOKING</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
               ( bookings.length===0 || error) && (<Failure message={error?"Something went wrong":"No bookings found"} />)
            )
            }
        </div>
    )
}
