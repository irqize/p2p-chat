import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import lobbyEvents from '../../../shared/LobbyEventsEnum'

import { domain } from '../../../shared/config'
import Button from '../reusable/button'
import './index.css'

import Client from './Client'

const Lobby = props => {
    let [clients, setClients] = useState(null);
    useEffect(() => {
        setClients(props.lobby.members.map(member => {
            return <Client key={member.id} data={member} />
        }));
    }, [props.lobby]);

    const getShareLink = () => {
        if (props.lobby.password) {
            return domain + 'join?lobbyId=' + props.lobby.id + '&password' + props.lobby.password;
        }
        else {
            return domain + 'join?lobbyId=' + props.lobby.id;
        }
    }

    return (
        <>
            <div className="lobby-top-bar">
                <div id="lobbyId">Lobby ID: {props.lobby.id}</div>
                <div id="connectedClients">Connected clients: {props.lobby.members.length + 1}</div>
            </div>
            <div className="line top"></div>
            <div className="lobby-cameras">
                {clients}
            </div>
            <div className="line bottom"></div>
            <div className="lobby-bottom-bar">
                <Button id="lobby-leave-button" text="LEAVE ROOM" clickAction={props.leave} />
                <Button id="lobby-copy-link" text="COPY LINK" clickAction={() => { navigator.clipboard.writeText(getShareLink()) }} />
            </div>
        </>
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