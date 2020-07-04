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
            socket.on(enums.createLobby, (name, maxCapacity, password) => this.createLobby(socket, name, maxCapacity, password));
            socket.on(enums.joinLobby, (name, id, password) => this.joinLobby(socket, name, id, password));
        });
        console.log('Listening for incoming connections on port ' + this.port);
    }

    joinLobby(socket, name, id, password = null) {
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
        if (typeof name != 'string' || !name) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.nameNotSpecified);
        }

        this.lobbies.get(id).join(socket, name);
    }

    createLobby(socket, name, maxCapacity, password = null) {
        if (maxCapacity < 2 || !(password === null || typeof password == 'string')) {
            return socket.emit(enums.createLobbyError, enums.createLobbyErrorTypes.unknown);
        }
        if (socket.inLobby) {
            return socket.emit(enums.createLobbyError, enums.createLobbyErrorTypes.alreadyInLobby);
        }
        if (typeof name != 'string' || !name) {
            return socket.emit(enums.createLobbyError, enums.createLobbyErrorTypes.nameNotSpecified);
        }

        let id = v4();
        while (this.lobbies.has(id)) id = v4();

        this.lobbies.set(id, new Lobby(id, socket, name, maxCapacity, this.io, () => {
            this.lobbies.delete(id);
        }, password));

    }
}

module.exports = Service;