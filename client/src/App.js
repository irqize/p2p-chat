import React, { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';

import menuEventsEnums from '../../shared/MenuEventsEnum';
import lobbyEventsEnums from '../../shared/LobbyEventsEnum';

const endpoint = 'http://127.0.0.1:3000';

function App() {
    useEffect(() => {
        const socket = socketIOClient(endpoint);
        socket.emit(menuEventsEnums.createLobby, 10);
        socket.on(lobbyEventsEnums.connection.created, (id) => console.log(id));
        socket.on(menuEventsEnums.createLobbyError, (err) => console.log(err));
    }, []);

    return <h1></h1>;
}

export default App;