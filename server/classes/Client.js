class Client {
    #socket;

    #isStreamingAudio = false;
    #isStreamingVideo = false;
    #isStreamingScreen = false;
    #hasScribbleBoard = false;
    #lobby;

    constructor(socket, lobby, isAdmin = false) {
        this.#socket = socket;
        this.#lobby = lobby;
        this.isAdmin = isAdmin;
    }
}

module.exports = Client;