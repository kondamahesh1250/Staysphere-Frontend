import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from 'antd';
import Room from '../Components/Room';
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';
import { Link } from 'react-router-dom';
import "../App.css";

const { RangePicker } = DatePicker;

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [duplicateRooms, setDuplicateRooms] = useState([]);

  const [searchkey, setSearchKey] = useState('');
  const [type, setType] = useState('all');

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await axios.get(`${BASE_URL}/rooms/getallrooms`)).data;
        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  function filterByDate(dates) {
    const startDate = dates[0]?.format("DD-MM-YYYY");
    const endDate = dates[1]?.format("DD-MM-YYYY");
    setFromDate(startDate);
    setToDate(endDate);

    let tempRooms = [];

    for (const room of duplicateRooms) {
      let isAvailable = true; // Reset for each room

      for (const booking of room.currentbookings) {
        const bookingStart = moment(booking.fromStartDate, "DD-MM-YYYY");
        const bookingEnd = moment(booking.toEndDate, "DD-MM-YYYY");

        // Check if selected range overlaps with existing booking
        if (
          moment(startDate, "DD-MM-YYYY").isBetween(bookingStart, bookingEnd, null, "[]") ||
          moment(endDate, "DD-MM-YYYY").isBetween(bookingStart, bookingEnd, null, "[]") ||
          bookingStart.isBetween(moment(startDate, "DD-MM-YYYY"), moment(endDate, "DD-MM-YYYY"), null, "[]") ||
          bookingEnd.isBetween(moment(startDate, "DD-MM-YYYY"), moment(endDate, "DD-MM-YYYY"), null, "[]")
        ) {
          isAvailable = false;
          break; // If not available, no need to check further bookings
        }
      }

      // Add only available rooms
      if (isAvailable) {
        tempRooms.push(room);
      }
    }

    setRooms(tempRooms);
  }


  function filterBySearch() {
    const tempRooms = duplicateRooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()));
    setRooms(tempRooms);
    setError(true);
  }

  function filterByType(e) {
    setType(e);
    if (e !== 'all') {
      const tempRooms = duplicateRooms.filter(room => room.type.toLowerCase() === e.toLowerCase());
      setRooms(tempRooms);
      setError(true);
    }
    else {
      setRooms(duplicateRooms);
    }

  }

  const disabledDate = (current) => {
    return current && current < moment().startOf("day"); // Disable past dates
  };

  return (
    <div className='filtercollection'>
      <div className='filterhome'>
        <Link to={"/"} ><button><i class="fa-solid fa-house"></i> Home</button></Link>
      </div>
      <div className='filtercriteria'>
        <div>
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} className='rangepicker' disabledDate={disabledDate} />
        </div>
        <div>
          <input type="text" placeholder='Search rooms' className='searchroom'
            value={searchkey} onChange={(e) => { setSearchKey(e.target.value) }} onKeyUp={filterBySearch} />
        </div>
        <select className='selectroom' value={type} onChange={(e) => { filterByType(e.target.value) }}>
          <option value="all">All</option>
          <option value="delux">Delux</option>
          <option value="non-delux">Non-Delux</option>
          <option value="suite">Suite</option>
          <option value="executive">Executive</option>
          <option value="luxury villa">Luxury Villa</option>
          <option value="budget">Budget</option>
        </select>
      </div>
      <div style={{ margin: "0px" }}>
        {loading ? (
          <Loader />
        ) : (rooms.length > 0 ? (
          rooms.map((room) => {
            return <div>
              <Room room={room} fromDate={fromDate} toDate={toDate} />
            </div>
          })
        ) :
          <>
            {error &&
              (
                <Failure message={"Sorry , no rooms found"} />
              )
            }
          </>

        )}
      </div>
    </div>
  );
};

export default Homescreen;
