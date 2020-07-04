const enums = {
    createLobby: 'create lobby',
    createLobbyError: 'create lobby error',
    createLobbyErrorTypes: {
        unknown: 'unknown error',
        alreadyInLobby: 'already in lobby'
    },

    joinLobby: 'join lobby',
    joinLobbyError: 'join lobby error',
    joinLobbyErrorTypes: {
        badId: 'bad id format',
        lobbyFull: 'lobby full',
        doesntExist: 'lobby doesnt exist',
        alreadyInLobby: 'already in lobby',
        badPassword: 'bad password'
    }
}

module.exports = Object.freeze(enums);