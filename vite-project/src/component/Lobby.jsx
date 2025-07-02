import React, { useCallback, useEffect, useState } from 'react'
import {useSocket} from '../context/socket'
import {useNavigate} from 'react-router-dom';
export default function Lobby() {
  let {socket} = useSocket();
  let [details, setDetails] = useState({
    email:'',
    roomId: '',
  })
  let navigate = useNavigate()

  let handelChange = useCallback(
     (e) =>{
    let {name,value} = e.target;
    setDetails(prev => ({
      ...prev,
      [name]:value
    }))
  },[])

  let handelSubmit =useCallback(
     (e) =>{
    e.preventDefault();
    // console.log(details)
    socket.emit('Room-join', {details});

    setDetails({
      email:'',
      roomId:''
    })
  }
  ,[details])
  const joinRoom = useCallback((data)=>{
    const {email, roomId} = data.details;
    // console.log(data)
    // console.log(roomId);
    navigate(`/room/${roomId}`);
  },[navigate])

  useEffect(()=>{
    socket.on('Room-join', joinRoom);
    return ()=>{
      socket.off('Room-join', joinRoom);
    }
  })

  
  return (
    <div>
      <h1>
        Lobby
      </h1>
      <form onSubmit={handelSubmit}>
        <label htmlFor="email">
          Email ID
        </label>
        <input type="text" name='email' value={details.email} onChange={handelChange} />
        <label htmlFor="room">Room ID</label>
        <input type="text" name='roomId' value={details.roomId} onChange={handelChange} />
        <button type="submit">
          Join
        </button>
      </form>
    </div>
  )
}
