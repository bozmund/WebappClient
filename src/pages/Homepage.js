import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Room from '../components/Room'
import 'antd/dist/reset.css';
import { DatePicker, Space,  } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

function Homepage() {

  let [hotels, sethotels] = useState([]);
  const [duplicatehotes, setduplicatehotes] = useState([]);
  let [fromdate, setfromdate] = useState('');
  let [todate, settodate] = useState('')
  const [loading, setloading] = useState(false);
  const [searchkey, setsearchkey] = useState('')
  const[type , settype]=useState('all')
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRooms() {
      try {
        if(localStorage.getItem('currentUser')===null)
        {
          window.location.href='/login'
        }
        setloading(true)
        const response = await axios.get('https://webappserver-5c4z.onrender.com/api/rooms/getallrooms')
        sethotels(response.data)
        setduplicatehotes(response.data)
        setloading(false)
      } catch (error) {
        setError(true)
        console.log(error)
        setloading(false)
      }
    }
    fetchRooms()
  }, []);

  function filterBySearch() {
    const dupdate = duplicatehotes.filter(room => room.name.toLowerCase().includes(searchkey))
    sethotels(dupdate)
  }

  function filterByType(e) {
    settype(e)
    if (e !== 'all') {
      const dupdate = duplicatehotes.filter(room => room.type.toLowerCase().includes(e.toLowerCase()))
      sethotels(dupdate)
    }
    else {
      sethotels(duplicatehotes)
    }

  }

  function switchLetters(str) {
    if (str.length < 5) {
      throw new Error("String must be at least 5 characters long");
    }

    // Extract parts of the string
    const firstTwo = str.slice(0, 2);
    const third = str[2];
    const fourthAndFifth = str.slice(3, 5);
    const rest = str.slice(5);

    // Switch the letters and concatenate
    const result = fourthAndFifth[0] + fourthAndFifth[1] + third + firstTwo[0] + firstTwo[1] + rest;

    return result;
  }

  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    // Rearrange to YYYY-MM-DD format
    const formattedDate = `${year}-${month}-${day}`;
    const parsedDate = new Date(formattedDate);

    if (isNaN(parsedDate)) {
      console.error(`Invalid date format: ${dateString}`);
      return null;
    }

    return parsedDate;
  }

  function filterByDate(dates) {
    if (dates === null) {
      hotels = duplicatehotes;
      sethotels(duplicatehotes);
      return;
    }

    // Convert the incoming dates to Date objects (parse for 'DD-MM-YYYY')
    const fromDate = new Date(dates[0]).setHours(0, 0, 0, 0); // Start of the day
    const toDate = new Date(dates[1]).setHours(0, 0, 0, 0); // End of the day

    if (!fromDate || !toDate) {
      console.error('Error parsing fromDate or toDate');
      return;
    }

    setfromdate(new Date(dates[0]).toISOString().split('T')[0]); // 'YYYY-MM-DD' format
    settodate(new Date(dates[1]).toISOString().split('T')[0]);

    let temp = [];

    for (let room of duplicatehotes) {
      let availability = false;

      for (let booking of room.currentbookings) {
        if (room.currentbookings.length) {
          let bookingFromdate = parseDate(booking.fromdate).setHours(0, 0, 0, 0);
          let bookingTodate = parseDate(booking.todate).setHours(0, 0, 0, 0);

          if (
            (fromDate < bookingFromdate && toDate < bookingFromdate) ||  // Before the booking range
            (fromDate > bookingTodate && toDate > bookingTodate)        // After the booking range
          ) {
            availability = true;
          }
          availability = false;
        }
      }

      // Add room if available or if no bookings exist
      if (availability || room.currentbookings.length === 0) {
        temp.push(room);
      }
    }

    sethotels(temp);
    hotels = temp;
  }




  return (
    <div className='container'>
      <div className="row bs p-3 m-5">
        <div className="col-md-4">
          <RangePicker style={{ height: "38px" }} onChange={filterByDate} format='MM-DD-YYYY' className='m-2' />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control i2 m-2"
            placeholder='Search Rooms'
            value={searchkey}
            onKeyUp={filterBySearch}
            onChange={(e) => { setsearchkey(e.target.value) }}
          />
        </div>
        <div className="col-md-4">
          <select className="form-control m-2" value={type} onChange={(e) => { filterByType(e.target.value) }} >

            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non Delux</option>

          </select>
        </div>
      </div>
      <div className='row justify-content-center mt-5'>
        {loading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <h1>Error</h1>
        ) : (
          hotels.map((room) => {
            return <div className='col-md-9 mt-2'>
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          })
        )}
      </div>
    </div>
  )
}

export default Homepage