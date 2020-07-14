import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import lobbyEvents from '../../../shared/LobbyEventsEnum'

import { addNotification } from '../../store/notifications/notificationsActions'
import { leaveLobbyAction } from '../../store/actions'

import Notifications from '../notifications'


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



    const userVideo = useRef(null)
    useEffect(() => {
        if (!userVideo.current) return;
        userVideo.current.muted = true;
        userVideo.current.autoplay = true;
        userVideo.current.srcObject = props.stream;

    });

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
                <Notifications />
                {clients}
            </div>
            <div className="line bottom"></div>
            <div className="lobby-bottom-bar">
                <Button id="lobby-leave-button" text="LEAVE ROOM" clickAction={props.leave} />
                <Button id="lobby-copy-link" text="COPY LINK" clickAction={() => { navigator.clipboard.writeText(getShareLink()); props.addNotification('Join link copied to clipboard', false) }} />
                <video id="user-video" ref={userVideo} />
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lobby: state.main.lobby,
        stream: state.main.stream
    }
}

const mapDispatchToProps = dispatch => {
    return {
        leave: () => dispatch(leaveLobbyAction()),
        addNotification: (content, isError) => dispatch(addNotification(content, isError))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);