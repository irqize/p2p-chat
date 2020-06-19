const socket = require('socket.io');
const { v4 } = require('uuid');

const Lobby = require('./Lobby');
const enums = require('../../shared/MenuEventsEnum');

class Service {
    #port = 3000;
    #io = null;

    lobbies = {};

    constructor(port) {
        this.#port = port;
    }

    start() {
        this.#io = socket(this.#port);

        this.#io.on('connection', socket => {
            socket.inLobby = false;
            socket.on(enums.createLobby, () => this.createLobby(socket));
            socket.on(enums.joinLobby, (id) => this.joinLobby(socket, id));
        });
        console.log('Listening for incoming connections on port ' + this.#port);
    }

    joinLobby(socket, id) {
        if (typeof id != "string") {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.badId);
        }
        if (socket.inLobby) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.alreadyInLobby);
        }
        if (typeof this.lobbies[id] == 'undefined') {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.doesntExist);
        }
        if (this.lobbies[id].isFull()) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.lobbyFull);
        }

        this.lobbies[id].join(socket);
    }

    createLobby(socket) {
        if (socket.inLobby) {
            return socket.emit(enums.joinLobbyError, enums.joinLobbyErrorTypes.alreadyInLobby);
        }

        let id = v4();
        while (typeof id != 'undefined') id = v4();

        this.lobbies[id] = new Lobby(id, socket, this.#io);
    }
}

module.exports = Service;