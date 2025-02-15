import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import { Tabs, ConfigProvider } from 'antd';
import { Failure } from '../Components/Failure';
import Loader from '../Components/Loader';
import "../App.css";

const Adminscreen = () => {

    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));


    useEffect(() => {
        if (!token) {
            navigate("/homescreen", { replace: true });
            return;
        }

        fetchUserRole(token);
    }, [token]);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    async function fetchUserRole(token) {
        try {
            const response = await axios.get(`${BASE_URL}/users/verifyuser`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response?.data;

            // Redirect if user is not an admin
            if (!data.isAdmin) {
                navigate("/homescreen", { replace: true });
            }

        } catch (error) {
            console.log(error);
            localStorage.removeItem("token");
            setToken(null);
        }
    }


    const items = [
        {
            key: '1',
            label: 'Bookings',
            children: <>
                <Bookings />
            </>
        },
        {
            key: '2',
            label: 'Rooms',
            children: <>
                <Rooms />
            </>
        },
        {
            key: '3',
            label: 'Add Room',
            children: <>
                <AddRoom />
            </>
        },
        {
            key: '4',
            label: 'Users',
            children: <>
                <Users />
            </>
        }
    ];

    return (
        <div style={{ marginTop: "10px", marginLeft: "10px", marginRight: "10px" }}>
            <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>Admin Panel</h2>
            <ConfigProvider
                theme={{
                    components: {
                        Tabs: {
                            itemColor: "black", // Inactive tab color
                            itemActiveColor: "black", // Active tab color
                            inkBarColor: "#d9d9d9", // Active underline color
                            itemHoverColor: "#d9d9d9",
                            itemSelectedColor: "black",
                        },
                    },
                }}
            >
                <Tabs defaultActiveKey="1" items={items} />
            </ConfigProvider>
        </div>
    )
}

export default Adminscreen;


export const Bookings = () => {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        async function Bookings() {
            try {
                setLoading(true);
                const data = (await axios.get(`${BASE_URL}/bookings/getallbookings`)).data;
                setBookings(data);
                setLoading(false);
                setError(false);

            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(true);
            }
        }
        Bookings();
    }, [])
    return (
        <div className="container mt-4">
            <h3 className="text-left mb-4">Bookings Details</h3>
            {loading && <Loader />}

            <div className="table-responsive mb-5">
                {bookings.length > 0 ? (
                    <>
                        <table className="table table-bordered table-hover text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Booking ID</th>
                                    <th>User ID</th>
                                    <th>Room</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Booking Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 &&
                                    bookings.map((booking) => (
                                        <tr key={booking?._id}>
                                            <td>{booking?._id}</td>
                                            <td>{booking?.userid}</td>
                                            <td>{booking?.room}</td>
                                            <td>{booking?.fromStartDate}</td>
                                            <td>{booking?.toEndDate}</td>
                                            <td>
                                                <span
                                                    className={`badge ${booking.status === 'cancelled'
                                                        ? 'bg-danger'
                                                        : 'bg-success'
                                                        }`}
                                                >
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>
                ) : (<>
                    <div style={{ textAlign: "center", justifyContent: "center" }}>
                        <img src="https://static.thenounproject.com/png/4440902-200.png" alt="" />
                    </div>
                </>)}
            </div>
            {error && (<Failure message={"Sorry , we are unable to fetch bookings at this time."} />)}

        </div>

    )
}


export const Rooms = () => {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [show, setShow] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const [showDelete, setShowDelete] = useState(false);

    const handleClose = () => {
        setShow(false);
        setUpdatedData({});
    };
    const handleShow = (room) => {
        setSelectedRoom(room);
        setUpdatedData(room);
        setShow(true);
    };

    const handleShowDelete = (room) => {
        setSelectedRoom(room);
        setShowDelete(true);
    }

    const handleCloseDelete = () => {
        setShowDelete(false);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSaveChanges = async () => {
        if (!selectedRoom) {
            alert('Please select a room to update');
            return;
        }

        try {
            const { data } = await axios.put(`${BASE_URL}/rooms/update/${selectedRoom._id}`, updatedData);
            if (data) {
                Swal.fire('Success!', 'Room details updated successfully', 'success');
                Roomfetch();
            }
            else {
                Swal.fire('Oops', 'Update Failed!', 'error');
            }
            handleClose();
        } catch (error) {
            console.log(error);
            Swal.fire('Oops', 'Something went wrong', 'error');
        }
    }

    const handleDelete = async () => {
        if (!selectedRoom) {
            alert('Please select a room to delete');
            return;
        }
        const roomid = selectedRoom._id;
        try {
            const { data } = await axios.delete(`${BASE_URL}/rooms/delete/${roomid}`)
            if (data) {
                Swal.fire('Success!', 'Room deleted successfully', 'success');
                Roomfetch();
            }
            else {
                Swal.fire('Oops', 'Delete Failed!', 'error');
            }
            handleCloseDelete();
        } catch (error) {
            console.log(error);
            Swal.fire('Oops', 'Something went wrong', 'error');
        }
    }


    async function Roomfetch() {
        try {
            setLoading(true);
            const { data } = await axios.get(`${BASE_URL}/rooms/getallrooms`);
            setRooms(data);
            setLoading(false);
            setError(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
        }
    }
    useEffect(() => {
        Roomfetch();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="text-left mb-4">Rooms Details</h3>
            {loading && <Loader />}

            <div className="table-responsive mb-5">
                {rooms.length > 0 ? (
                    <>
                        <table className="table table-bordered table-hover text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Room ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Rent Per Day</th>
                                    <th>Max Count</th>
                                    <th>Phone Number</th>
                                    <th colSpan={"2"}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.length > 0 &&
                                    rooms.map((room) => (
                                        <tr key={room?._id}>
                                            <td>{room?._id}</td>
                                            <td>{room?.name}</td>
                                            <td>{room?.type}</td>
                                            <td>{room?.rentperday}</td>
                                            <td>{room?.maxcount}</td>
                                            <td>{room?.phonenumber}</td>
                                            <td><button className='a_room_btn' onClick={() => handleShow(room)}>Modify</button></td>
                                            <td><button className='a_room_btn' onClick={() => handleShowDelete(room)}>Delete</button></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        {/* Delete Room Modal */}
                        <Modal show={showDelete} onHide={handleCloseDelete} centered>
                            <Modal.Header>
                                <Modal.Title>Delete Room</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedRoom && (
                                    <p>Are you sure want to remove the room!!</p>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseDelete}>Cancel</Button>
                                <Button variant="danger" onClick={handleDelete}>Delete</Button>
                            </Modal.Footer>
                        </Modal>


                        {/* Modify Room Modal */}
                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header>
                                <Modal.Title>Modify Room Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedRoom && (
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Room Name</label>
                                            <input type="text" className="form-control" name='name' value={updatedData?.name} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Type</label>
                                            <input type="text" className="form-control" name='type' value={updatedData?.type} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Rent Per Day</label>
                                            <input type="number" className="form-control" name='rentperday' value={updatedData?.rentperday} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Max Count</label>
                                            <input type="number" className="form-control" name='maxcount' value={updatedData?.maxcount} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input type="number" className="form-control" name='phonenumber' value={updatedData?.phonenumber} onChange={handleChange} />
                                        </div>
                                    </form>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleSaveChanges}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                ) : (<>
                    <div style={{ textAlign: "center", justifyContent: "center" }}>
                        <img src="https://static.thenounproject.com/png/4440902-200.png" alt="errlr in loading image" />
                    </div>
                </>)}
            </div>

            {error && (<Failure message={"Sorry , we are unable to fetch rooms at this time."} />)}

        </div>

    )
}


export const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleShowDelete = (id) => {
        setSelectedUser(id);
        setShowDelete(true);
    }

    const handleCloseDelete = () => {
        setShowDelete(false);
    }


    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleDelete = async () => {
        if (!selectedUser) {
            alert("please select user");
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.delete(`${BASE_URL}/users/delete/${selectedUser}`);
            setLoading(false);
            if (data) {
                Swal.fire('Success!', 'User removed successfully', 'success');
                Userfetch();
            }
            else {
                Swal.fire('Oops', 'Delete Failed!', 'error');
            }
            handleCloseDelete();
        } catch (error) {
            console.log(error);
            Swal.fire('Oops', 'Something went wrong', 'error');
        }

    }

    async function Userfetch() {
        try {
            setLoading(true);
            const data = (await axios.get(`${BASE_URL}/users/getallusers`)).data;
            setUsers(data);
            setLoading(false);
            setError(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
        }
    }
    useEffect(() => {
        Userfetch();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="text-left mb-4">Users Details</h3>
            {loading && <Loader />}

            <div className="table-responsive">
                {users.length > 0 ? (<>

                    <table className="table table-bordered table-hover text-center">
                        <thead className="thead-dark">
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>isAdmin</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((user) => (
                                    <tr key={user?._id}>
                                        <td>{user?._id}</td>
                                        <td>{user?.name}</td>
                                        <td>{user?.email}</td>
                                        <td>{user?.isAdmin ? "YES" : "NO"}</td>
                                        <td><button className='a_room_btn' onClick={() => handleShowDelete(user?._id)}>Delete</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* Delete User Modal */}
                    <Modal show={showDelete} onHide={handleCloseDelete} centered>
                        <Modal.Header>
                            <Modal.Title>Delete User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedUser && (
                                <p>Are you sure want to remove the user!!</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDelete}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        </Modal.Footer>
                    </Modal>
                </>
                ) : (<>
                    <div style={{ textAlign: "center", justifyContent: "center" }}>
                        <img src="https://static.thenounproject.com/png/4440902-200.png" alt="error in loading image" />
                    </div>
                </>)}
            </div>
            {error && (<Failure message={"Sorry , we are unable to fetch users at this time."} />)}
        </div>
    )
}


export const AddRoom = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rentperday, setRentPerDay] = useState("");
    const [maxcount, setMaxCount] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [type, setType] = useState("");
    const [imageUrl1, setImageUrl1] = useState("");
    const [imageUrl2, setImageUrl2] = useState("");
    const [imageUrl3, setImageUrl3] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [features, setFeatures] = useState({
        "Wifi": false,
        "Ac": false,
        "Tv": false,
        "Parking": false,
        "Lake View": false,
        "Balcony": false,
        "Safe Deposit Box": false,
        "Work Desk": false
    });

    const handleFeatureChange = (event) => {
        const { name, checked } = event.target;
        setFeatures((prevFeatures) => ({
            ...prevFeatures,
            [name]: checked, // Updates the selected feature
        }));
    };

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    async function addRoom(e) {
        e.preventDefault();

        const newRoom = {
            name,
            description,
            rentperday,
            maxcount,
            phonenumber,
            type,
            imageurls: [imageUrl1, imageUrl2, imageUrl3],
            features,
            location: {
                "lat": parseFloat(latitude),
                "lng": parseFloat(longitude)
            }
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${BASE_URL}/rooms/addroom`, newRoom);
            setLoading(false);
            setError(false);

            if (data) {
                Swal.fire('Success!', 'Room added successfully', 'success');
                setName("");
                setDescription("");
                setRentPerDay("");
                setMaxCount("");
                setPhoneNumber("");
                setType("");
                setImageUrl1("");
                setImageUrl2("");
                setImageUrl3("");
                setFeatures({});
                setLatitude(null);
                setLongitude(null);
            }
            else {
                Swal.fire('Oops', 'Delete Failed!', 'error');
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setError(true);
            Swal.fire("Error", "Failed to add room", "error");
            setLoading(false);
        }
    }

    return (
        <div className='addroom'>
            <h3>Add Room</h3>
            {loading && (<Loader />)}

            <form onSubmit={addRoom} className='addroomcont'>

                <div className='leftinput'>
                    <input type="text" placeholder="Room Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="text" placeholder="Rent Per Day" value={rentperday} onChange={(e) => setRentPerDay(e.target.value)} required />
                    <input type="text" placeholder="Max Count" value={maxcount} onChange={(e) => setMaxCount(e.target.value)} required />
                    <input type="text" placeholder="Room Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <input type="text" placeholder="Phone Number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} required />
                </div>
                <div className='rightinput'>
                    <input type="text" placeholder="Image URL1" value={imageUrl1} onChange={(e) => setImageUrl1(e.target.value)} required />
                    <input type="text" placeholder="Image URL2" value={imageUrl2} onChange={(e) => setImageUrl2(e.target.value)} required />
                    <input type="text" placeholder="Image URL3" value={imageUrl3} onChange={(e) => setImageUrl3(e.target.value)} required />
                    <input type="text" name="latitude" placeholder='Latitude' value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                    <input type="text" name="longitude" placeholder='Longitude' value={longitude} onChange={(e) => setLongitude(e.target.value)} required />

                    <div className='addroomfeatures'>
                        <label><input type="checkbox" name="Wifi" checked={features.Wifi} onChange={handleFeatureChange} /> Wifi</label>
                        <label><input type="checkbox" name="Ac" checked={features.Ac} onChange={handleFeatureChange} /> AC</label>
                        <label><input type="checkbox" name="Tv" checked={features.Tv} onChange={handleFeatureChange} /> TV</label>
                        <label><input type="checkbox" name="Parking" checked={features.Parking} onChange={handleFeatureChange} /> Parking</label>
                        <label><input type="checkbox" name="Balcony" checked={features.Balcony} onChange={handleFeatureChange} /> Balcony</label>
                        <label><input type="checkbox" name="Lake View" checked={features["Lake View"]} onChange={handleFeatureChange} /> Lake View</label>
                        <label><input type="checkbox" name="Safe Deposit Box" checked={features["Safe Deposit Box"]} onChange={handleFeatureChange} /> Safe Deposit Box</label>
                        <label><input type="checkbox" name="Work Desk" checked={features["Work Desk"]} onChange={handleFeatureChange} /> Work Desk</label>
                    </div>

                    <div className='addroombtn'>
                        <button type='submit' className='a_room_btn'>Submit</button>
                    </div>
                </div>
            </form>
            {error && (<Failure message={"Sorry , we are unable to add rooms at this time."} />)}
        </div >
    )
}


