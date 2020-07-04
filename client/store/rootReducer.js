import { combineReducers } from 'redux'
import lobbyEvents from '../../shared/LobbyEventsEnum'
import menuEvents from '../../shared/MenuEventsEnum'
import lobby from '../src/lobby';

const initialState = {
    inLobby: false,
    joinLobbyError: null,
    createLobbyError: null,
    myId: null,
    lobby: null
}

export default function (state = initialState, action) {
    const newState = { ...initialState }
    switch (action.type) {
        case menuEvents.createLobby:
            if (action.success) {
                newState.inLobby = true;
                newState.lobby = {
                    id: action.id,
                    members: []
                }
            } else {
                newState.createLobbyError = action.error;
            }
            return newState;

        case menuEvents.joinLobby:
            if (action.success) {
                newState.inLobby = true;
                newState.myId = action.myId;
                newState.lobby = {
                    id: action.id,
                    members: action.members
                }
            } else {
                newState.joinLobbyError = action.error;
            }

            return newState;
        case lobbyEvents.connection.leave:
            return newState;
        default:
            return state;
    }
}