const Client = require('./Client');

class Lobby {
    #users = [];
    #io;
    #id;

    constructor(id, creatorSocket, io) {
        this.#id = id;
        this.#io = io;

        creatorSocket.inLobby = false;
        this.#users.push(new Client(creatorSocket, this, true));
    }

    join(socket) {
        socket.inLobby = true;

    }

    isFull() {
        return false;
        // TODO
    }
}

module.exports = Lobby;