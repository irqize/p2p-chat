# Peer to Peer Videochat

Videochat web app which is basically signaling service for the new RTCPeerConnection
API currently supported by most of the major browsers. Users can create chat rooms
and easily share a link to it for other people to join. Thanks to the network structure
data send to the server is minimal therefore improving the privacy. The frontend is
written in Redux and React, the backend uses Node.js and is written in plain javascript
and uses WebSocket for the connection.

## Instalation

- Run `git clone https://github.com/irqize/p2p-chat.git`
- Run `npm install` in `server` and `client` directories.
- Modify `shared/config.js` and `server/config.js` files.
- Run `npm run build-prod` in client folder to generate source files for the website.
- Run `npm start` in `server` directory to start the WebSocket server.

## Incoming features

The app is still under development. New features are coming, including:

- More management abilities for the chatroom creator.
- Screensharing
- Improved UI
- More customization for the UI
- File sharing
