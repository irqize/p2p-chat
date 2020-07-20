import lobbyEvents from '../../shared/LobbyEventsEnum'
import menuEvents from '../../shared/MenuEventsEnum'
import controlsActions from './controls/controlsActionTypes'

import stunConfiguration from './stunConfiguration'

const initialState = {
    inLobby: false,
    joinLobbyError: null,
    createLobbyError: null,
    myId: null,
    myName: null,
    stream: null,
    lobby: null,
    controls: {
        muted: false,
        silent: false,
        popup: false
    }
}

export default function (state = initialState, action) {
    let newState = { ...initialState }
    switch (action.type) {
        case menuEvents.createLobby:
            newState = { ...state };
            if (action.success) {
                newState.inLobby = true;
                newState.myName = action.name;
                newState.myId = action.myId;
                newState.lobby = {
                    id: action.id,
                    members: [],
                    admin: action.myId,
                    password: action.password
                }
            } else {
                newState.createLobbyError = action.error;
                state.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
            return newState;

        case menuEvents.joinLobby:
            newState = { ...state };
            if (action.success) {
                action.members.forEach(member => member.muted = false);
                newState.inLobby = true;
                newState.myId = action.myId;
                newState.myName = action.name;
                newState.lobby = {
                    id: action.id,
                    members: action.members,
                    admin: action.admin,
                    password: action.password
                }
            } else {
                newState.joinLobbyError = action.error;
                state.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            return newState;
        case lobbyEvents.connection.leave:
            state.stream.getTracks().forEach(track => {
                track.stop();
            });
            return newState;
        case lobbyEvents.members.newMember:
            action.member.muted = state.controls.silent;
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

            newState.lobby.members = newState.lobby.members.map(member => {
                if (member.id === action.id) {
                    member.peerConnection = new RTCPeerConnection(stunConfiguration);
                    member.mediaStream = new MediaStream();
                    return { ...member }
                } else {
                    return member
                }
            });

            return newState;
        case lobbyEvents.peerConnection.sendCandidate:
            newState = { ...state };

            state.lobby.members.forEach(member => {
                if (member.id === action.id) {
                    member.peerConnection.addIceCandidate(action.candidate);
                }
            })

            return newState;

        case lobbyEvents.members.switchMute:
            newState = { ...state };
            newState.lobby = { ...state.lobby };
            newState.lobby.members = state.lobby.members.map(member => {
                if (member !== action.member) return { ...member };
                const newMember = { ...member };
                newMember.muted = !member.muted;
                return newMember;
            });

            return newState

        case lobbyEvents.members.changeMuteAll:
            newState = { ...state };
            newState.lobby = { ...state.lobby };
            newState.lobby.members = state.lobby.members.map(member => {
                const newMember = { ...member };
                newMember.muted = action.to;
                return newMember;
            });
            return newState;

        case menuEvents.requestStream:
            newState = { ...state };

            newState.stream = action.stream;

            return newState;

        case controlsActions.changeMute:
            newState = { ...state };
            newState.controls = { ...state.controls };
            newState.controls.muted = action.to;
            return newState

        case controlsActions.changeSilent:
            newState = { ...state };
            newState.controls = { ...state.controls };
            newState.controls.silent = action.to;
            newState.stream.muted = action.to;
            return newState

        case controlsActions.changePopup:
            newState = { ...state };
            newState.controls = { ...state.controls };
            newState.controls.popup = action.to;
            return newState

        case lobbyEvents.members.changeSilence:
            newState = { ...state }
            newState.lobby = { ...state.lobby }
            newState.lobby.members = newState.lobby.members.map(member => {
                if (member.id !== action.id) return member;
                const newMember = { ...member }
                newMember.silent = action.to
                return newMember;
            });
            return newState;


        default:
            return state;
    }
}