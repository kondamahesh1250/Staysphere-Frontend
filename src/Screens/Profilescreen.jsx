import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';
import Swal from 'sweetalert2';
import { Tag } from 'antd';



const Profilescreen = () => {

    const [user, setUser] = useState(null);
    const items = [
        {
            key: '1',
            label: 'Profile',
            children: <div className="profile-container">
                <h2 className="profile-heading">Profile</h2>
                <h4 className="profile-detail">Name: {user?.name}</h4>
                <h4 className="profile-detail">Email: {user?.email}</h4>
                <h4 className="profile-detail">isAdmin: {user?.isAdmin ? 'Yes' : 'No'}</h4>
            </div>

        },
        {
            key: '2',
            label: 'Bookings',
            children: <div style={{ textAlign: "center" }}>
                <h3>My Bookings</h3>
                <MyBookings user={user} />
            </div>
        }
    ];

    useEffect(() => {

        const isGuest = JSON.parse(localStorage.getItem("guestUser"));
        if (isGuest) {
            return setUser(isGuest);
        }

        const fetchUser = async () => {
            const token = localStorage.getItem("token"); // Get token from storage
            if (!token) {
                return;
            }; // If no token, user is not logged in
            try {
                const response = await axios.get('/api/users/verifyuser', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response?.data);

            } catch (error) {
                console.error("Failed to fetch user:", error);
                localStorage.removeItem("token"); // Remove invalid token
                localStorage.removeItem("guestUser");
            }
        };

        fetchUser();

    }, [])
    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} style={{ margin: "10px" }}></Tabs>
        </div>
    )
}

export default Profilescreen;



export function MyBookings({ user }) {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {

        async function getBookings() {
            try {
                setLoading(true);
                const rooms = (await axios.post('/api/bookings/getbookingsbyuserid', { userid: user?._id })).data;
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
            const result = (await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })).data;
            setLoading(false);
            Swal.fire('Request Sent', 'Your booking has been cancelled', 'success').then(result => {
                window.location.reload();
            });
        } catch (error) {
            console.log(error);
            Swal.fire('Opps ', 'Something went wrong', 'error');
        }

    }
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
                        <p><b>Status</b>: {booking.status === 'cancelled' ? (<Tag color='red'>CANCELLED</Tag>) : (<Tag color='green'>CONFIRMED</Tag>)}</p>

                        {booking.status !== 'cancelled' && (
                            <div className='cancelbtn'>
                                <button onClick={() => cancelBooking(booking._id, booking.roomid)}>CANCEL BOOKING</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                error && (<Failure />)
            )
            }
        </div>
    )
}
