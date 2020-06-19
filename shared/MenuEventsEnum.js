const enums = {
    joinLobby: 'join lobby',
    createLobby: 'create lobby',
    joinLobbyError: 'join lobby error',
    joinLobbyErrorTypes: {
        badId: 'bad id format',
        lobbyFull: 'lobby full',
        doesntExist: 'lobby doesnt exist',
        alreadyInLobby: 'already in lobby'
    }
}

module.exports = Object.freeze(enums);