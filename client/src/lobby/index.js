import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import lobbyEvents from '../../../shared/LobbyEventsEnum'

import Client from './Client'

const Lobby = props => {
    let [clients, setClients] = useState(null);
    useEffect(() => {
        setClients(props.lobby.members.map(member => {
            return <Client key={member.id} data={member} />
        }));
    }, [props.lobby]);

    return (
        <div>
            {props.lobby.id}
            <button onClick={props.leave}>Leave lobby</button>
            {clients}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lobby: state.lobby
    }
}

const mapDispatchToProps = dispatch => {
    return {
        leave: () => dispatch({ type: lobbyEvents.connection.leave })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);