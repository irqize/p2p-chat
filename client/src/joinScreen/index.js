import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import * as qs from 'query-string';

import { addNotification } from '../../store/notifications/notificationsActions'
import { createLobbyAction, joinLobbyAction, requestStreamAction } from '../../store/actions'

import Notifications from '../notifications'

import './index.css';

import Button from '../reusable/button';
import TextInput from '../reusable/textInput'

import menuEvents from '../../../shared/MenuEventsEnum'
import { siteName } from '../../../shared/config'

const stateEnum = {
    mainMenu: 'main menu',
    creatingRoom: 'creating room',
    joiningRoom: 'joining room'
}

const JoinScreen = (props) => {
    const [menuState, changeMenuState] = useState(stateEnum.mainMenu);

    const [lobbyId, setLobbyId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (props.isjoinlink) {
            changeMenuState(stateEnum.joiningRoom);
            const params = qs.parse(location.search);
            if (params.lobbyId) setLobbyId(params.lobbyId);
            if (params.password) setPassword(params.password);
        }
    });

    // Toast notifications
    useEffect(() => {
        if (props.joinLobbyError) {
            props.addNotification(props.joinLobbyError, true);
        }
    }, [props.joinLobbyError]);
    useEffect(() => {
        if (props.createLobbyError) {
            props.addNotification(props.createLobbyError, true);
        }
    }, [props.createLobbyError])

    const handleNameChange = e => setName(e.target.value);
    const handleLobbyIdChange = e => setLobbyId(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value);

    useEffect(() => {
        if (!props.isjoinlink) {
            setLobbyId('');
            setName('');
            setPassword('')
        }
    }, [menuState])

    const joinLobby = () => {
        if (lobbyId === '') {
            return props.addNotification('You need to provide a lobby ID', true);
        }
        if (name === '') {
            return props.addNotification('You need to provide a name', true)
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            props.requestStream(stream);
            props.joinLobby(name, lobbyId, password == '' ? null : password);
        });
    }

    const createLobby = () => {
        if (name === '') {
            return props.addNotification('You need to provide a name', true)
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            props.requestStream(stream);
            props.createLobby(name, Number.MAX_VALUE, password == '' ? null : password);

        }).catch(e => addNotification("You need to allow the camera usage to join the videochat.", false));
    }

    const mainMenu = (<div className="main-menu">
        <div className="welcome-text">Welcome to {siteName}!</div>
        <Button id="goToJoiningRoom" clickAction={() => changeMenuState(stateEnum.joiningRoom)} text="JOIN ROOM" />
        <Button id="goToCreatingRoom" clickAction={() => changeMenuState(stateEnum.creatingRoom)} text="CREATE ROOM" />
    </div>);

    const creatingRoom = (<div className="create-room">
        <div className="create-room-text">Create the chatroom</div>
        <TextInput id="createRoomName" width={500} placeholder="Your name" onChange={handleNameChange} />
        <TextInput id="createRoomPassword" width={500} placeholder="Password (optional)" onChange={handlePasswordChange} />
        <Button id="createRoom" text="CREATE ROOM" clickAction={createLobby} />
    </div>);

    const joiningRoom = (<div className="join-room">
        <div className="join-room-text">Join the chatroom</div>
        <TextInput value={lobbyId} id="joinLobbyId" width={500} placeholder="Lobby ID" onChange={handleLobbyIdChange} />
        <TextInput id="joinRoomName" width={500} placeholder="Your name" onChange={handleNameChange} />
        <TextInput value={password} id="joinRoomPassword" width={500} placeholder="Password (optional)" onChange={handlePasswordChange} />
        <Button id="joinRoom" text="JOIN ROOM" clickAction={joinLobby} />
    </div>);

    const getContent = () => {
        switch (menuState) {
            case stateEnum.mainMenu:
                return mainMenu;
            case stateEnum.creatingRoom:
                return creatingRoom;
            case stateEnum.joiningRoom:
                return joiningRoom;
        }
    }

    return (
        <>
            <Notifications />
            <div className="joinscreen-container">
                {getContent()}
            </div>
        </>
    )

}


const mapStateToProps = state => {
    return {
        createLobbyError: state.main.createLobbyError,
        joinLobbyError: state.main.joinLobbyError
    }

}

const mapDispatchToProps = dispatch => {
    return {
        createLobby: (name, maxCapacity, password) => dispatch(createLobbyAction(name, maxCapacity, password)),
        joinLobby: (name, id, password) => dispatch(joinLobbyAction(name, id, password)),
        requestStream: (stream) => dispatch(requestStreamAction(stream)),
        addNotification: (content, isError) => dispatch(addNotification(content, isError))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinScreen);