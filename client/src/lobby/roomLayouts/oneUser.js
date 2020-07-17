import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Controls from './controls'
import Notifications from '../../notifications'

import './css/oneUser.css'

const oneUser = props => {
    const userVideoRef = useRef(null);
    const myVideoRef = useRef(null);

    const [isActive, setActive] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        if (!userVideoRef.current) return;
        userVideoRef.current.srcObject = props.member.mediaStream;
    }, [props.member.mediaStream])

    useEffect(() => {
        if (!myVideoRef.current) return;
        myVideoRef.current.srcObject = props.stream;
        myVideoRef.current.muted = true;
    }, [props.stream]);

    const onMouseMove = _ => {
        setActive(true);
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => {
            setActive(false)
        }, 3000));
    }

    return (
        <div id="one-user-container" className={isActive ? 'active' : ''} onMouseMove={onMouseMove}>
            <video id="user-video" ref={userVideoRef} autoPlay={true} />
            <video id="my-video" ref={myVideoRef} autoPlay={true} />

            <div id="user-name">{props.member.name}</div>

            <Controls />
            <Notifications />
        </div>
    )
}

const mapStateToProps = state => ({
    member: state.main.lobby.members[0],
    stream: state.main.stream
});


export default connect(mapStateToProps, null)(oneUser);
