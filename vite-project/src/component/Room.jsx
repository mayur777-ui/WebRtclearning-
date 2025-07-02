import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/socket';
import ReactPlayer from 'react-player';
import PeerService  from '../utils/Peer';
export default function Room() {
  const { socket } = useSocket();
//   const [someOneInroom, setSomeOneInroom] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [mystream, setMyStrem] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const handleUserjoin = useCallback((data) => {
    const { id } = data;
    setRemoteSocketId(id);
  }, [socket]);

//   const handleCheckISinROOM = useCallback((isSomeInRoom) => {
//     setSomeOneInroom(isSomeInRoom);
//     console.log(someOneInroom);
//   }, [socket]);

//   useEffect(() => {
//     socket.on('room:user-exists', handleCheckISinROOM);
//     return () => socket.off('room:user-exists', handleCheckISinROOM);
//   }, [socket, handleCheckISinROOM]);


    const handleIncommingCall = useCallback(async({from,offer})=>{
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
        setMyStrem(stream);
        // console.log("i am here");
        // console.log(`incomming call from ${from} to this offer ${offer}`)
        const ans = await  PeerService.getAns(offer);
        socket.emit('call:accepted',{to:from, ans});
    },[socket]);

    const sendStreams = useCallback(()=>{
        for(const track of mystream.getTracks()){
            PeerService.peer.addTrack(track, mystream);
        }
    },[mystream])
    const handleCallaccepted = useCallback(({from, ans})=>{
        PeerService.setLocalDescription(ans);
        console.log('call accepted');
        sendStreams();
    },[sendStreams]);

    const handleNegoNeeded = useCallback(async()=>{
            const offer = await PeerService.getOffer();
            socket.emit('peer:nego:needed', {to:remoteSocketId, offer})
        },[socket,remoteSocketId]);
    


    const handleNegoNeededIncomming = useCallback(async({from,offer})=>{
        const ans = await PeerService.getAns(offer);
        // console.log(offer);
        socket.emit('peer:nego:done', {to: from, ans});
    },[socket])

    const handelNegofinal = useCallback(({from, ans})=>{
        PeerService.setLocalDescription(ans);
    },[]);


    useEffect(()=>{
        PeerService.peer.addEventListener('negotiationneeded', handleNegoNeeded);

        return  ()=>{
            PeerService.peer.removeEventListener('negotiationneeded',handleNegoNeeded);
        }
    },[handleNegoNeeded])

    useEffect(()=>{
        PeerService.peer.addEventListener('track', async( ev )=>{
            const rms = ev.streams;
            setRemoteStream(rms[0]);

        });
    },[]);
  useEffect(() => {
    socket.on('user:joined', handleUserjoin);
    socket.on('incomming:call',handleIncommingCall);
    socket.on('call:accepted', handleCallaccepted);
    socket.on('peer:nego:needed', handleNegoNeededIncomming)
    socket.on('peer:nego:final', handelNegofinal);
    return () =>{ socket.off('user:joined', handleUserjoin)
        socket.off('incomming:call',handleIncommingCall);
        socket.off('call:accepted', handleCallaccepted);
        socket.off('peer:nego:needed', handleNegoNeededIncomming);
        socket.off('peer:nego:final', handelNegofinal);
    };
  }, [socket, handleUserjoin,handleIncommingCall,handleCallaccepted,handleNegoNeededIncomming,handelNegofinal]);

  const handelCallUser = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
    const offer = await PeerService.getOffer();
    socket.emit('user:call', {to: remoteSocketId, offer});
    setMyStrem(stream);
  }, [remoteSocketId]);
  return (
    <div>
      <h1>Room</h1>
      {
       remoteSocketId
        ? <h3>✅ Connected</h3>
        : <h3>🕸️ Only you are in room</h3>}
        {mystream && <button onClick={sendStreams}>Send Stream</button>}
       {
         remoteSocketId && <button onClick={handelCallUser}>Call</button>
       }

       {mystream && (<><h1>My stream</h1>
        <ReactPlayer playing muted url={mystream} height="300px" width="200px"/>
        </>)}

        {remoteStream && (<><h1>remote stream</h1>
        <ReactPlayer playing muted url={remoteStream} height="300px" width="200px"/>)
        </>)}
    </div>
  );
}
