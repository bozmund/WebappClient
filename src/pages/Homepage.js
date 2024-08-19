import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Room from '../components/Room'

function Homepage() {

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:3000/api/rooms/getallrooms')
        setRooms(response.data)
        setLoading(false)
      } catch (error) {
        setError(true)
        console.log(error)
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  return (
    <div className='container'>
      <div className='row justify-content-center mt-5'>
        {loading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <h1>Error</h1>
        ) : (
          rooms.map((room) => {
            return <div className='col-md-9 mt-2'>
              <Room room={room} />
            </div>
          })
        )}
      </div>
    </div>
  )
}

export default Homepage