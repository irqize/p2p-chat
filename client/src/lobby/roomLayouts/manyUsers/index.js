import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import Controls from '../controls'
import Notifications from '../../../notifications'

import { switchMute } from '../../../../store/actions'

import './index.css'

import User from './user'

const manyUsers = (props) => {
    const myVideoRef = useRef(null);

    useEffect(() => {
        if (!myVideoRef.current) return;
        myVideoRef.current.muted = true;
        myVideoRef.current.autoplay = true;
        myVideoRef.current.srcObject = props.stream;
    }, [props.stream])

    return (
        <div id="many-users-container">
            {props.users.map(user => <User key={user.id} user={user} switchMute={() => props.switchMute(user)} />)}
            <video id="my-video" ref={myVideoRef} />
            <Controls />
            <Notifications />
        </div>
    )
}

const mapStateToProps = state => ({
    users: state.main.lobby.members,
    stream: state.main.stream
});

const mapDispatchToProps = dispatch => ({
    switchMute: member => dispatch(switchMute(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(manyUsers);