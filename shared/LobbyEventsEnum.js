const enums = {
    connection: {
        join: 'joined room',
        created: 'created room',
        newAdmin: 'new admin',
        leave: 'leave room'
    },
    members: {
        newMember: 'new member',
        memberLeft: 'member left'
    },
    peerConnection: {
        create: 'create',
        sendOffer: 'send offer',
        sendAnswer: 'send answer',
        sendCandidate: 'send candidate',
        gotOffer: 'got offer',
        gotAnswer: 'got answer',
        gotCandidate: 'got candidate',
        offerRequested: 'offer requested'
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