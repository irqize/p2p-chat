import React, { useState } from 'react'
import { connect } from 'react-redux'

import menuEvents from '../../../shared/MenuEventsEnum'

const JoinScreen = (props) => {
    const [lobbyid, setLobbyid] = useState('');

    const handleChange = (e) => {
        setLobbyid(e.target.value);
    }

    return (
        <div>
            <button onClick={() => props.createLobby(10)}>Create Lobby</button>
            <br />
            <input type="text" value={lobbyid} onChange={handleChange} />
            <button onClick={() => { props.joinLobby(lobbyid) }}>Join Lobby</button>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        createLobby: (maxCapacity, password = null) => dispatch({ type: menuEvents.createLobby, maxCapacity, password }),
        joinLobby: (id, password = null) => dispatch({ type: menuEvents.joinLobby, id, password })
    }
}

export default connect(null, mapDispatchToProps)(JoinScreen);