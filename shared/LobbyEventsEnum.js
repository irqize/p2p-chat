const enums = {
    connection: {
        join: 'joined room',
        created: 'created room',
        newAdmin: 'new admin',
        leave: 'leave room'
    },
    start: {
        video: 'start video',
        voice: 'start voice',
        screenshare: 'start screenshare'
    },
    stop: {
        video: 'stop video',
        voice: 'stop voice',
        screenshare: 'stop screenshare'
    }
}

module.exports = Object.freeze(enums);