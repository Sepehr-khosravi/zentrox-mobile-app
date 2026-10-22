import React from 'react';
import {SocketProvider} from './context/SocketContext';
import App from "./App";

export default function Main(){
    return(
        <SocketProvider>
            <App />
        </SocketProvider>
    )
}