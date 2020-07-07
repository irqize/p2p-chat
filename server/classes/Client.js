const lobbyEventsEnum = require('../../shared/LobbyEventsEnum');

class Client {
    socket;
    id;
    isStreamingAudio = false;
    isStreamingVideo = false;
    name;
    lobby;

    constructor(socket, name, lobby, isAdmin = false) {
        this.socket = socket;
        this.lobby = lobby;
        this.isAdmin = isAdmin;
        this.name = name;
        this.id = socket.id;

        this.startSocketListeners(socket);

        socket.inLobby = true;
    }

    startSocketListeners(socket) {
        socket.on('disconnect', () => {
            this.lobby.leave(this);
        });

        socket.on(lobbyEventsEnum.connection.leave, () => {
            socket.inLobby = false;
            socket.leave(this.lobby.id);
            this.stopSocketListeners();
            this.lobby.leave(this);
        });

        this.socket.on(lobbyEventsEnum.peerConnection.gotCandidate, (toId, candidate) => this.gotCandidate(toId, candidate));
        this.socket.on(lobbyEventsEnum.peerConnection.gotOffer, (toId, offer) => this.gotOffer(toId, offer));
        this.socket.on(lobbyEventsEnum.peerConnection.gotAnswer, (toId, answer) => this.gotAnswer(toId, answer));
    }

    stopSocketListeners() {
        this.socket.removeAllListeners(lobbyEventsEnum.peerConnection.gotCandidate);
        this.socket.removeAllListeners(lobbyEventsEnum.peerConnection.gotOffer);
        this.socket.removeAllListeners(lobbyEventsEnum.peerConnection.gotAnswer);
    }

    // Active methods
    sendCandidate(fromId, candidate) {
        this.socket.emit(lobbyEventsEnum.peerConnection.sendCandidate, fromId, candidate);
    }

    requestOffer(id) {
        this.socket.emit(lobbyEventsEnum.peerConnection.offerRequested, id);
    }

    sendOffer(fromId, offer) {
        this.socket.emit(lobbyEventsEnum.peerConnection.sendOffer, fromId, offer);
    }

    sendAnswer(fromId, answer) {
        this.socket.emit(lobbyEventsEnum.peerConnection.sendAnswer, fromId, answer);
    }


    // Listeners
    gotCandidate(toId, candidate) {
        if (typeof toId === 'string' && typeof candidate === 'object' && this.lobby.hasUser(toId) && toId !== this.id) {
            this.lobby.getUser(toId).sendCandidate(this.id, candidate);
        }
    }

    gotOffer(toId, offer) {
        if (typeof toId === 'string' && typeof offer === 'object' && this.lobby.hasUser(toId) && toId !== this.id) {
            this.lobby.getUser(toId).sendOffer(this.id, offer);
        }
    }

    gotAnswer(toId, answer) {
        if (typeof toId === 'string' && typeof answer === 'object' && this.lobby.hasUser(toId) && toId !== this.id) {
            this.lobby.getUser(toId).sendAnswer(this.id, answer);
        }
    }

    setAdmin() {
        this.isAdmin = true;
    }
}

module.exports = Client;