const Client = require('./Client');
const lobbyEventsEnum = require('../../shared/LobbyEventsEnum');

class Lobby {
    users = [];
    admin;
    io;
    id;
    password;
    maxCapacity;
    onDestroy;

    constructor(id, creatorSocket, maxCapacity, io, onDestroy, password = null) {
        this.id = id;
        this.io = io;

        this.password = password;
        this.maxCapacity = maxCapacity;
        this.onDestroy = onDestroy;

        this.admin = new Client(creatorSocket, this, true);
        creatorSocket.join(this.id);
        creatorSocket.emit(lobbyEventsEnum.connection.created, id);
        this.users.push(this.admin);
    }

    join(socket) {
        socket.join(this.id);
        this.users.push(new Client(creatorSocket, this, false));

        // Emit client joining
        this.io.to(this.id).emit(lobbyEventsEnum.connection.join, socket.id);
    }

    leave(client) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] == client) {
                this.users.splice(i, 1);
                if (this.users.length === 0) {
                    this.onDestroy();
                    return
                }

                // Emit client leaving
                this.io.to(this.id).emit(lobbyEventsEnum.connection.leave, socket.id);

                if (client.isAdmin) {
                    this.users[0].setAdmin();
                    this.admin = this.users[0];
                    // Emit a new adming
                    this.io.to(this.id).emit(lobbyEventsEnum.connection.newAdmin, socket.id);
                }
            }
        }
    }

    authenticate(password) {
        if (!this.password) {
            return true;
        }

        return password === this.password;
    }

    isFull() {
        return this.users.length >= this.maxCapacity;
    }
}

module.exports = Lobby;