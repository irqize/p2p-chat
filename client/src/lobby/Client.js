import React, { useRef, useEffect } from 'react'

const Client = (props) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.autoplay = true;
        videoRef.current.srcObject = props.data.mediaStream;
    }, [props.data.mediaStream])

    return (
        <div>
            <video ref={videoRef} />
        </div>
    )
}

export default Client;