import { combineReducers } from 'redux'
import lobbyEvents from '../../shared/LobbyEventsEnum'
import menuEvents from '../../shared/MenuEventsEnum'
import lobby from '../src/lobby';
import socketMiddleware from './socketMiddleware';

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
            newState.lobby.members = [...state.lobby.members];
            newState.lobby.members.push(action.member);

            return newState;
        default:
            return state;
    }
}