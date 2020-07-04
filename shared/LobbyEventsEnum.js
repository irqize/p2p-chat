const enums = {
    connection: {
        join: 'joined room',
        created: 'created room',
        newAdmin: 'new admin',
        leave: 'leave room'
    },
    members: {
        newMember: 'new member'
    },
    peerConnection: {
        sendOffer: 'send offer',
        sendAnswer: 'send answer',
        sendCandidate: 'send candidate',
        gotOffer: 'got offer',
        gotAnswer: 'got answer',
        gotCandidate: 'got candidate'
    },
    start: {
        video: 'start video',
        voice: 'start voice'
    },
    stop: {
        video: 'stop video',
        voice: 'stop voice'
    }
}

module.exports = Object.freeze(enums);