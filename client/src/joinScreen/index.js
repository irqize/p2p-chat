import React, { useState } from 'react'
import { connect } from 'react-redux'

import menuEvents from '../../../shared/MenuEventsEnum'

const JoinScreen = (props) => {
    const [lobbyid, setLobbyid] = useState('');
    const [name, setName] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleLidChange = (e) => {
        setLobbyid(e.target.value);
    }

    return (
        <div>
            <input type="text" value={name} onChange={handleNameChange} />
            <button onClick={() => props.createLobby(name, 10)}>Create Lobby</button>
            <br />

            <input type="text" value={lobbyid} onChange={handleLidChange} />
            <button onClick={() => { props.joinLobby(name, lobbyid) }}>Join Lobby</button>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        createLobby: (name, maxCapacity, password = null) => dispatch({ type: menuEvents.createLobby, maxCapacity, password, name }),
        joinLobby: (name, id, password = null) => dispatch({ type: menuEvents.joinLobby, id, password, name })
    }
}

export default connect(null, mapDispatchToProps)(JoinScreen);