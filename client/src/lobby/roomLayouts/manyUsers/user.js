import React, { useRef, useEffect, useState } from 'react'

import sound_on from '../icons/sound_on.svg'
import sound_off from '../icons/sound_off.svg'

const User = (props) => {
    const videoRef = useRef(null);

    const [isActive, setActive] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        if (!videoRef.current) return;
        if (!videoRef.current.srcObject) videoRef.current.srcObject = props.user.mediaStream;
        videoRef.current.muted = props.user.muted
    }, [props.user]);

    const onMouseMove = _ => {
        setActive(true);
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => {
            setActive(false);
        }, 1000))
    }

    return (
        <div className={`user${isActive ? ' active' : ''}`}>
            <div className="user-video" onMouseMove={onMouseMove}>
                <video ref={videoRef} autoPlay={true} />
            </div>
            <div className="user-name">
                {props.user.name}
            </div>
            <img className={`user-soundcontrol${props.user.muted ? ' muted' : ''}`} onClick={props.switchMute} src={props.user.muted ? sound_off : sound_on} />

        </div>
    )
}

export default User;