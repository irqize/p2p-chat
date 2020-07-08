const enums = {
    createLobby: 'create lobby',
    createLobbyError: 'create lobby error',
    createLobbyErrorTypes: {
        unknown: 'unknown error',
        alreadyInLobby: 'already in lobby',
        nameNotSpecified: 'name wasnt specified'
    },

    joinLobby: 'join lobby',
    joinLobbyError: 'join lobby error',
    joinLobbyErrorTypes: {
        badId: 'bad id format',
        lobbyFull: 'lobby full',
        doesntExist: 'lobby doesnt exist',
        alreadyInLobby: 'already in lobby',
        badPassword: 'bad password',
        nameNotSpecified: 'name wasnt specified'
    },
    requestStream: 'request stream'
}

module.exports = Object.freeze(enums);