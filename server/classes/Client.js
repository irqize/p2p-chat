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

        this.startSocketListeners();

        socket.inLobby = true;
    }

    startSocketListeners() {
        socket.on('disconnect', () => {
            lobby.leave(this);
        });

        socket.on(lobbyEventsEnum.connection.leave, () => {
            socket.inLobby = false;
            socket.leave(lobby.id);
            this.stopSocketListeners();
            lobby.leave(this);
        });

        this.socket.on(lobbyEventsEnum.peerConnection.gotCandidate, (toId, candidate) => this.gotCandidate(toId, candidate));
        this.socket.on(lobbyEventsEnum.peerConnection.gotOffer, (toId, offer) => this.gotOffer(toId, offer));
        this.socket.on(lobbyEventsEnum.peerConnection.gotAnswer, (toId, answer) => this.gotAnswer(toId, answer));
    }

    stopSocketListeners() {
        this.socket.off(lobbyEventsEnum.peerConnection.gotCandidate);
        this.socket.off(lobbyEventsEnum.peerConnection.gotOffer);
        this.socket.off(lobbyEventsEnum.peerConnection.gotAnswer);
    }

    // Active methods
    sendCandidate(fromId, candidate) {
        this.socket.emit(lobbyEventsEnum.peerConnection.gotCandidate, fromId, candidate);
    }

    requestOffer(id) {
        this.socket.emit(lobbyEventsEnum.peerConnection.offerRequested, id);
    }

    sendOffer(fromId, offer) {
        this.socket.emit(lobbyEventsEnum.peerConnection.gotOffer, fromId, offer);
    }

    sendAnswer(fromId, answer) {
        this.socket.emit(lobbyEventsEnum.peerConnection.gotAnswer, fromId, answer);
    }


    // Listeners
    gotCandidate(toId, candidate) {
        if (typeof toId === 'string' && typeof candidate === 'string' && this.lobby.hasUser(toId) && toId !== this.id) {
            this.lobby.getUser(toId).sendCandidate(this.id, candidate);
        }
    }

    gotOffer(toId, offer) {
        if (typeof toId === 'string' && typeof offer === 'string' && this.lobby.hasUser(toId) && toId !== this.id) {
            this.lobby.getUser(toId).sendOffer(this.id, offer);
        }
    }

    gotAnswer(toId, answer) {
        if (typeof toId === 'string' && typeof answer === 'string' && this.lobby.hasUser(toId) && toId !== this.id) {
            this.lobby.getUser(toId).sendAnswer(this.id, answer);
        }
    }

    setAdmin() {
        this.isAdmin = true;
    }
}

module.exports = Client;