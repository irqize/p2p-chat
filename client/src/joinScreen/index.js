import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

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

    const handleNameChange = e => setName(e.target.value);
    const handleLobbyIdChange = e => setLobbyId(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value);

    useEffect(() => {
        setLobbyId('');
        setName('');
        setPassword('')
    }, [menuState])

    const getContent = () => {
        switch (menuState) {
            case stateEnum.mainMenu:
                return (
                    <div className="main-menu">
                        <div className="welcome-text">Welcome to {siteName}!</div>
                        <Button id="goToJoiningRoom" clickAction={() => changeMenuState(stateEnum.joiningRoom)} text="JOIN ROOM" />
                        <Button id="goToCreatingRoom" clickAction={() => changeMenuState(stateEnum.creatingRoom)} text="CREATE ROOM" />
                    </div>
                );
            case stateEnum.creatingRoom:
                return (<div className="create-room">
                    <div className="create-room-text">Create the chatroom</div>
                    <TextInput id="createRoomName" width={500} placeholder="Your name" onChange={handleNameChange} />
                    <TextInput id="createRoomPassword" width={500} placeholder="Password (optional)" onChange={handlePasswordChange} />
                    <Button id="createRoom" text="CREATE ROOM" clickAction={() => props.createLobby(name, Number.MAX_VALUE, password == '' ? null : password)} />
                </div>);
            case stateEnum.joiningRoom:
                return (<div className="join-room">
                    <div className="join-room-text">Join the chatroom</div>
                    <TextInput id="joinLobbyId" width={500} placeholder="Lobby ID" onChange={handleLobbyIdChange} />
                    <TextInput id="joinRoomName" width={500} placeholder="Your name" onChange={handleNameChange} />
                    <TextInput id="joinRoomPassword" width={500} placeholder="Password (optional)" onChange={handlePasswordChange} />
                    <Button id="joinRoom" text="JOIN ROOM" clickAction={() => props.joinLobby(name, lobbyId, password == '' ? null : password)} />

                </div>);
        }
    }

    return (
        <div className="joinscreen-container">
            {getContent()}
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