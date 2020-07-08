import React, { useRef, useEffect } from 'react'

import './client.css'

const Client = (props) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.autoplay = true;
        videoRef.current.srcObject = props.data.mediaStream;
    }, [props.data.mediaStream])

    return (
        <div className="user-video">
            <video ref={videoRef} />
        </div>
    )
}

export default Client;