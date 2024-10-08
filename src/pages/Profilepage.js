import React, { useEffect, useState } from "react";
import { Tabs, Tag } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";

const { TabPane } = Tabs;  // Import the TabPane from Tabs

const user = JSON.parse(localStorage.getItem('currentUser'));

export const MyOrders = () => {
  const [mybookings, setmybookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setloading(true);
        const { data } = await axios.post("https://webappserver-5c4z.onrender.com/api/bookings/getuserbookings", {
          userid: user._id,
        });
        setmybookings(data);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (bookingid, roomid) => {
    try {
      setloading(true);
      await axios.post('https://webappserver-5c4z.onrender.com/api/bookings/cancelbooking', { bookingid, userid: user._id, roomid });
      setloading(false);
      Swal.fire('Congrats', 'Your Room has been cancelled successfully', 'success').then(() => {
        window.location.href = '/profile';
      });
    } catch (error) {
      Swal.fire('Oops', 'Something went wrong', 'error').then(() => {
        window.location.href = '/profile';
      });
      setloading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        mybookings.map((booking) => (
          <div className="row" key={booking._id}>
            <div className="col-md-6 my-auto">
              <div className='bs m-1 p-2'>
                <h1>{booking.room}</h1>
                <p>BookingId : {booking._id}</p>
                <p>TransactionId : {booking.transactionId}</p>
                <p><b>Check In : </b>{booking.fromdate}</p>
                <p><b>Check Out : </b>{booking.todate}</p>
                <p><b>Amount : </b> {booking.totalAmount}</p>
                <p><b>Status</b> : {booking.status === 'booked' ? (<Tag color="green">Confirmed</Tag>) : (<Tag color="red">Cancelled</Tag>)}</p>
                <div className='text-right'>
                  {booking.status === 'booked' && (
                    <button className='btn btn-primary' onClick={() => cancelBooking(booking._id, booking.roomid)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

function Profilescreen() {
  return (
    <div className="mt-5 ml-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="My Profile" key="1">
          <div>
            <h1>Name : {user.name}</h1>
            <h1>Email : {user.email}</h1>
          </div>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyOrders />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;
