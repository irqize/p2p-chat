const socket = require('socket.io');
const { v4 } = require('uuid');

const Lobby = require('./Lobby');
const enums = require('../../shared/MenuEventsEnum');

class Service {
    port = 3000;
    io = null;

    lobbies = new Map();

    constructor(port) {
        this.port = port;
    }

    start() {
        this.io = socket(this.port);

        this.io.on('connection', socket => {
            socket.inLobby = false;
            socket.on(enums.createLobby, (maxCapacity, password) => this.createLobby(socket, maxCapacity, password));
            socket.on(enums.joinLobby, (id, password) => this.joinLobby(socket, id, password));
        });
        console.log('Listening for incoming connections on port ' + this.port);
    }

    joinLobby(socket, id, password = null) {
        if (typeof id != "string") {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.badId);
        }
        if (socket.inLobby) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.alreadyInLobby);
        }
        if (!this.lobbies.has(id)) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.doesntExist);
        }
        if (this.lobbies.get(id).isFull()) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.lobbyFull);
        }
        if (!this.lobbies.get(id).authenticate(password)) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.badPassword);
        }

        this.lobbies.get(id).join(socket);
    }

    createLobby(socket, maxCapacity, password = null) {
        if (maxCapacity < 2 || !(password === null || typeof password == 'string')) {
            return socket.emit(enums.createLobbyError, enums.createLobbyErrorTypes.unknown);
        }
        if (socket.inLobby) {
            return socket.emit(enums.createLobbyError, enums.createLobbyErrorTypes.alreadyInLobby);
        }

        let id = v4();
        while (this.lobbies.has(id)) id = v4();

        this.lobbies.set(id, new Lobby(id, socket, maxCapacity, this.io, () => {
            this.lobbies.delete(id);
        }, password));

    }
}

module.exports = Service;