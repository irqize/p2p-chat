import lobbyEvents from '../../shared/LobbyEventsEnum'
import menuEvents from '../../shared/MenuEventsEnum'

import stunConfiguration from './stunConfiguration'

const initialState = {
    inLobby: false,
    joinLobbyError: null,
    createLobbyError: null,
    myId: null,
    myName: null,
    lobby: null
}

export default function (state = initialState, action) {
    let newState = { ...initialState }
    switch (action.type) {
        case menuEvents.createLobby:
            if (action.success) {
                newState.inLobby = true;
                newState.myName = action.name;
                newState.myId = action.myId;
                newState.lobby = {
                    id: action.id,
                    members: [],
                    admin: action.id
                }
            } else {
                newState.createLobbyError = action.error;
            }
            return newState;

        case menuEvents.joinLobby:
            if (action.success) {
                newState.inLobby = true;
                newState.myId = action.myId;
                newState.myName = action.name;
                newState.lobby = {
                    id: action.id,
                    members: action.members,
                    admin: action.admin
                }
            } else {
                newState.joinLobbyError = action.error;
            }

            return newState;
        case lobbyEvents.connection.leave:
            return newState;
        case lobbyEvents.members.newMember:
            newState = { ...state };
            newState.lobby = { ...state.lobby }
            newState.lobby.members = [...state.lobby.members, action.member];

            action.member.peerConnection = new RTCPeerConnection(stunConfiguration);
            action.member.mediaStream = new MediaStream();
            newState.lobby.members = [...state.lobby.members, action.member];

            return newState;

        case lobbyEvents.members.memberLeft:
            newState = { ...state };
            newState.lobby = { ...state.lobby };
            newState.lobby.members = state.lobby.members.filter(user => user.id !== action.id);

            return newState;

        case lobbyEvents.connection.newAdmin:
            newState = { ...state };
            newState.lobby.members = [...state.lobby.members];
            newState.lobby.admin = action.id;

            return newState;

        case lobbyEvents.peerConnection.create:
            newState = { ...state };

            newState.lobby.members.forEach(member => {
                if (member.id === action.id) {
                    member.peerConnection = new RTCPeerConnection(stunConfiguration);
                    member.mediaStream = new MediaStream();
                }
            })

            return newState;
        case lobbyEvents.peerConnection.sendCandidate:
            newState = { ...state };

            state.lobby.members.forEach(member => {
                if (member.id === action.id) {
                    member.peerConnection.addIceCandidate(action.candidate);
                }
            })

            return newState;
        default:
            return state;
    }
}