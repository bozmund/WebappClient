import React, { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2'
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from '../components/Success'
import StripeCheckout from 'react-stripe-checkout'
import { useParams } from 'react-router-dom';

import moment from "moment"
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
AOS.refresh()
function BookingPage() {
    const { roomid, fromdate, todate } = useParams();
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false)
    const [success, setsuccess] = useState(false)
    const [room, setroom] = useState()
    // const roomid = searchParams.get('roomid');
    const fromdatemoment = moment(fromdate, 'DD-MM-YYYY');
    const todatemoment = moment(todate, 'DD-MM-YYYY');
    const totalDays = moment.duration(todatemoment.diff(fromdatemoment)).asDays() + 1
    const [totalAmount, settotalAmount] = useState()
    useEffect(() => {
        async function fetchData() {
          try {
            setloading(true);
            const response = await axios.post("webapp-server-iota.vercel.app/api/rooms/getroombyid", { roomid });
            const data = response.data;
            console.log(data);
            setroom(data);
            setloading(false);
            settotalAmount(data.rentperday * totalDays);
          } catch (error) {
            console.log(error);
            setloading(false);
          }
        }
        fetchData();
      }, [roomid, totalDays]);

    async function tokenHander(token) {

        console.log(token);
        const bookingDetails = {

            token,
            user: JSON.parse(localStorage.getItem('currentUser')),
            room,
            fromdate,
            todate,
            totalDays,
            totalAmount

        }

        try {
            setloading(true);
            const result = await axios.post('webapp-server-iota.vercel.app/api/bookings/bookroom', bookingDetails)
            setloading(false)
            Swal.fire('Congrats', 'Your Room has booked succeessfully', 'success').then(result => {
                window.location.href = '/profile'
            })
        } catch (error) {
            console.log(error);
            setloading(false)
            Swal.fire('Oops', 'Something went wrong , please try later', 'error')
        }

    }

    return (
        <div className='m-5'>

            {loading ? (<Loader />) : error ? (<Error />) : (

                <div className="row p-3 mb-5 bs" data-aos='flip-right' duration='2000'>

                    <div className="col-md-6 my-auto">

                        <div>
                            <h1> {room.name}</h1>
                            <img src={room.imageurls[0]} style={{ height: '400px' }} />
                        </div>

                    </div>
                    <div className="col-md-6 text-right">
                        <div>
                            <h1><b>Booking Details</b></h1>
                            <hr />

                            <p><b>Name</b> : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                            <p><b>From Date</b> : {fromdate}</p>
                            <p><b>To Date</b> : {todate}</p>
                            <p><b>Max Count </b>: {room.maxcount}</p>
                        </div>

                        <div className='mt-5'>
                            <h1><b>Amount</b></h1>
                            <hr />
                            <p>Total Days : <b>{totalDays}</b></p>
                            <p>Rent Per Day : <b>{room.rentperday}</b></p>
                            <h1><b>Total Amount : {totalAmount} /-</b></h1>

                            <StripeCheckout
                                amount={totalAmount * 100}
                                shippingAddress
                                token={tokenHander}
                                stripeKey='pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ'
                                currency='INR'
                            >

                                <button className='btn btn-primary'>Pay Now</button>

                            </StripeCheckout>
                        </div>



                    </div>

                </div>

            )}

        </div>
    )
}

export default BookingPage
