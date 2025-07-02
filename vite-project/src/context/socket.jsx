import React, { createContext, useContext, useMemo } from "react";
import {io} from 'socket.io-client';
const socketContext = createContext(null);

export const SocketProvider = ({ children }) => {
     const socket = useMemo(() => io("http://localhost:8000"), []);
    return (
        <socketContext.Provider value={{socket}}>
            {children}
        </socketContext.Provider>
    )
}

export const useSocket = () =>{
    const socket = useContext(socketContext);
    if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
    return socket;
}

