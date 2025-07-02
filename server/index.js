const {Server} = require('socket.io');

const io = new Server(8000,{
    cors: true
});


const EmailtoSocketID = new Map();
const SocketIdtoEmail = new Map();

io.on('connection', (socket)=>{
    console.log('Socket conneted', socket.id);
    socket.on('Room-join', (data)=>{
        // console.log(data.details);
        let roomId = data.details.room;
        // console.log(roomId);
        let email = data.details.email;
        EmailtoSocketID.set(email, socket.id);
        SocketIdtoEmail.set(socket.id, email);

        // let SocketsInRoom = await io.in(roomId).fetchSockets();
        // let existInRoom = SocketsInRoom.filter((s)=> s.id !== socket.id).map((s)=>({
        //     id: s.id,
        //     email: SocketIdtoEmail.get(s.id)
        // })); 
        // const otherUsers = SocketsInRoom.filter(s => s.id !== socket.id);
        // // console.log(otherUsers);
        // const isSomeInRoom = otherUsers.length > 0;
        // io.to(socket.id).emit('room:user-exists', isSomeInRoom);
        io.to(roomId).emit('user:joined',{email, id: socket.id});
        socket.join(roomId);
        io.to(socket.id).emit('Room-join',data);
    })
    socket.on('user:call', ({to, offer})=>{
        // console.log(to);
        io.to(to).emit('incomming:call',{from:socket.id, offer});
    })
    socket.on("call:accepted", ({to, ans})=>{
        io.to(to).emit("call:accepted", {from: socket.id, ans});
    })

    socket.on('peer:nego:needed',({to, offer})=>{
        console.log(offer);
        io.to(to).emit('peer:nego:needed',{from: socket.id, offer});
    })
    socket.on('peer:nego:done', ({to, ans})=>{
        io.to(to).emit('peer:nego:final', {from: socket.id, ans});
    });
});