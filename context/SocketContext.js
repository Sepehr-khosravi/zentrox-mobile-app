import React, { createContext, useState, useRef, useEffect } from 'react';
import ErrorNetwork from "../Error";
import { useNetInfo } from "@react-native-community/netinfo";
import { io } from 'socket.io-client';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serverAddress } from '../config/config';

export const SocketContext = createContext();

export  function SocketProvider({ children }) {
    const NetInfo = useNetInfo();
    const [socketReady, setSocketReady] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const initSocket = async () => {
            try {
                console.log("the system is connecting to the socket.")
                const token = await AsyncStorage.getItem("userToken");
                const newSocket = io(serverAddress, {
                    transports: ["websocket"],
                    auth: {
                        token: token || ""
                    },
                    extraHeaders: {
                        "X-Client-Type": "mobile-app"
                    }
                })
                newSocket.on("connect", () => {
                    console.log("Connected to socket server");
                    
                    setSocketReady(true);
                });
                newSocket.connect();

                newSocket.on("disconnect", () => {
                    console.log("disconnected to socket server");
                    setSocketReady(false);
                });
                newSocket.on("error", (error) => {
                    console.log("socket error : ", error);
                })
                socketRef.current = newSocket;
            }
            catch (e) {
                console.log("Socket init error : ", e);
            }
        }
        if (NetInfo.isConnected) {
            initSocket();
        }else{
            if(socketRef.current){
            socketRef.current.disconnect();
            socket.Ref.current = null;
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }

    }, [NetInfo.isConnected]);


    return (
        <SocketContext.Provider value={{socket: socketRef.current , socketReady}}>
            {children}
        </SocketContext.Provider>
    )
}