import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'

import add_button from './icons/add.svg'
import mic_on from './icons/mic_on.svg'
import mic_off from './icons/mic_off.svg'
import sound_on from './icons/sound_on.svg'
import sound_off from './icons/sound_off.svg'
import stopcall from './icons/stopcall.svg'

import './css/controls.css'

import * as controlsActions from '../../../store/controls/controlsActions'
import { leaveLobbyAction, changeMuteAll } from '../../../store/actions'
import { addNotification } from '../../../store/notifications/notificationsActions'

import { domain } from '../../../../shared/config'


const controls = (props) => {
    const { isMuted, isSilent, hasPopup } = props;
    const { changeMute, changeSilent, changePopup, stopCall, changeMuteAll } = props;

    const copyJoinLink = () => {
        navigator.clipboard.writeText(props.lobbyLink);
        props.addNotification('Join link copied to clipboard', false);
    }

    return (
        <div id="controls">
            <img id="add" src={add_button}
                className={`control ${hasPopup ? 'active' : ''}`}
                onClick={() => changePopup(!hasPopup)}
            />

            <img id="mute"
                src={isMuted ? mic_off : mic_on}
                className={`control ${isMuted ? 'active' : ''}`}
                onClick={() => changeMute(!isMuted)}
            />

            <img id="sound"
                src={isSilent ? sound_off : sound_on}
                className={`control ${isSilent ? 'active' : ''}`}
                onClick={() => changeMuteAll(!isSilent) && changeSilent(!isSilent)}
            />

            <img id="stopcall" src={stopcall} className={`control`}
                onClick={stopCall}
            />

            <div id="popup-container" className={`${hasPopup ? 'active' : ''}`}>
                <div id="popup">
                    <div>Lobby ID: {props.lobbyId}</div>
                    <div id="copy-link" onClick={copyJoinLink}>Copy link to share the chatroom</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isMuted: state.main.controls.muted,
    isSilent: state.main.controls.silent,
    hasPopup: state.main.controls.popup,
    lobbyId: state.main.lobby.id,
    lobbyLink: state.main.lobby.password ?
        domain + 'join?lobbyId=' + state.main.lobby.id + '&password' + state.main.lobby.password :
        domain + 'join?lobbyId=' + state.main.lobby.id
});

const mapDispatchToProps = dispatch => ({
    changeMute: (to) => dispatch(controlsActions.changeMute(to)),
    changeSilent: (to) => dispatch(controlsActions.changeSilent(to)),
    changePopup: (to) => dispatch(controlsActions.changePopup(to)),
    stopCall: () => dispatch(leaveLobbyAction()),
    addNotification: (content, isError) => dispatch(addNotification(content, isError)),
    changeMuteAll: to => dispatch(changeMuteAll(to))
});

export default connect(mapStateToProps, mapDispatchToProps)(controls);
