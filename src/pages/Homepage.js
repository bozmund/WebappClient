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

  function filterBySearch()
  {
    const dupdate = duplicatehotes.filter(room=>room.name.toLowerCase().includes(searchkey))
    sethotels(dupdate)
  }

  function filterByType(e)
  {
    settype(e)
    if(e!=='all'){
      const dupdate = duplicatehotes.filter(room=>room.type.toLowerCase().includes(e.toLowerCase()))
      sethotels(dupdate)
    }
    else{
      sethotels(duplicatehotes)
    }
   
  }

  function filterByDate(dates) {
    if(dates===null)
    {
      hotels=duplicatehotes
      sethotels(duplicatehotes)
      return
    }
    const fromDate = moment(dates[0].$d).startOf('day').format('MM-DD-YYYY')
    const toDate = moment(dates[1].$d).endOf('day').format('MM-DD-YYYY')
    setfromdate(fromDate)
    settodate(toDate)
    
    var temp=[]
    for (var room of duplicatehotes) {
      var availability = false;
      
      for (var booking of room.currentbookings) {
        
        if(room.currentbookings.length)
        {
          if (
            !moment(fromDate).isBetween(booking.fromdate, booking.todate) &&
            !moment(toDate).isBetween(booking.fromdate, booking.todate)
          ) {
            if (
              fromDate !== booking.fromdate &&
              fromDate !== booking.todate &&
              toDate !== booking.fromdate &&
              toDate !== booking.todate
            ) {
              availability = true;
            }
          }
        }
        
        
      }
      if(availability || room.currentbookings.length==0) 
      {
        temp.push(room)
      }
    }
    hotels = temp
    sethotels(temp)
  }

  return (
    <div className='container'>
      <div className="row bs p-3 m-5">
          <div className="col-md-4">
            <RangePicker style={{ height: "38px" }} onChange={filterByDate} format='DD-MM-YYYY' className='m-2'/>
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control i2 m-2"
              placeholder='Search Rooms'
              value={searchkey}
              onKeyUp={filterBySearch}
              onChange={(e)=>{setsearchkey(e.target.value)}}
            />
          </div>
          <div className="col-md-4">
            <select className="form-control m-2" value={type} onChange={(e)=>{filterByType(e.target.value)}} >

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