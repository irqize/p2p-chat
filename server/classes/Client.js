const lobbyEventsEnum = require('../../shared/LobbyEventsEnum');

class Client {
    socket;
    id;
    isStreamingAudio = true;
    isStreamingVideo = true;
    name;
    lobby;

    constructor(socket, name, lobby, isAdmin = false) {
        this.socket = socket;
        this.lobby = lobby;
        this.isAdmin = isAdmin;
        this.name = name;
        this.id = socket.id;

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