const lobbyEventsEnum = require('../../shared/LobbyEventsEnum');

class Client {
    socket;

    isStreamingAudio = false;
    isStreamingVideo = false;
    isStreamingScreen = false;

    lobby;

    constructor(socket, lobby, isAdmin = false) {
        this.socket = socket;
        this.lobby = lobby;
        this.isAdmin = isAdmin;

        socket.on('disconnect', () => {
            lobby.leave(this);
        });

        socket.on(lobbyEventsEnum.connection.leave, () => {
            socket.inLobby = false;
            socket.leave(lobby.id);
            lobby.leave(this);
        });

        socket.inLobby = true;
    }

    setAdmin() {
        this.isAdmin = true;
    }
}

module.exports = Client;