import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Failure } from '../Components/Failure';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';


const Bookingscreen = () => {

  const { id, fromDate, toDate } = useParams();


  const [user,setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const fromStartDate = moment(fromDate, 'DD-MM-YYYY')
  const toEndDate = moment(toDate, 'DD-MM-YYYY')

  const totalDays = moment.duration(toEndDate.diff(fromStartDate)).asDays() + 1;



  useEffect(() => {
  async function fetchUser() {
    const token = localStorage.getItem("token");
    if(!token){
      return;
    }
    const response = await axios.get("/api/users/verifyuser",{
      headers: {
        "Authorization": `Bearer ${token}`,
        }
    });
    setUser(response?.data);    
  }

  fetchUser();

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await axios.post('/api/rooms/getroombyid', { roomid: id })).data;
        setTotalAmount(totalDays * data.rentperday);
        setRooms(data);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchRooms();
  }, []);


  async function onToken(token) {
   
    const bookingDetails = {
      rooms,
      userid: user?._id,
      fromStartDate,
      toEndDate,
      totalAmount,
      totalDays,
      token
    }

    try {
      setLoading(true);
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      setLoading(false);
      Swal.fire('Congratulations','Your Room Booked Successfully','success').then((result)=>{
        window.location.href="/homescreen";
      })
    } catch (error) {
      setLoading(false);
      Swal.fire('Oops','Something went wrong','error');
    }
  }

  return (
    <div>
      {
        loading ? (<Loader />) : rooms ? (<div>

          <div className='bookcontainer'>
            <div className='bookimage'>
              <h1>{rooms.name}</h1>
              <img src={rooms.imageurls[0]} alt="" className='bigimg' />
            </div>
            <div className='bookdetails'>
              <div>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>Name: {user?.name} </p>
                  <p>From Date: {fromDate}</p>
                  <p>To Date: {toDate}</p>
                  <p>Max Count: {rooms.maxcount}</p>
                </b>
              </div>

              <div>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total Days: {totalDays}</p>
                  <p>Rent per Day: {rooms.rentperday}</p>
                  <p>Total Amount: {totalAmount}</p>
                </b>
              </div>

              <div>
                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency='INR'
                  stripeKey="pk_test_51QjGigGarWj667uiJMV1ge17ogXlCskZh4bIpKvYSoubKoxgkpDaYghxbCg3YKDo6qlBG09LdIm097BkrRpzhCAY00hnCL9J3F"
                >
                  <button >Pay Now</button>
                </StripeCheckout>

              </div>
            </div>
          </div>
        </div>) : (<Failure message={"Sorry , Please try again"} />)
      }
    </div>
  )
}

export default Bookingscreen;