import io from 'socket.io-client';
import { endpoint } from '../../shared/config'

import menuEvents from '../../shared/MenuEventsEnum'
import lobbyEvents from '../../shared/LobbyEventsEnum'

const socketMiddleware = () => {
    const socket = io(endpoint);

    return ({ dispatch, getState }) => next => action => {
        switch (action.type) {
            case menuEvents.createLobby:
                let { maxCapacity, password } = action;
                let removeListeners = () => {
                    socket.off(lobbyEvents.connection.created);
                    socket.off(menuEvents.createLobbyError);
                }

                socket.emit(menuEvents.createLobby, maxCapacity, password);

                socket.on(lobbyEvents.connection.created, id => {
                    action.success = true;
                    action.id = id;
                    removeListeners();
                    return next(action);
                });
                socket.on(menuEvents.createLobbyError, error => {
                    action.success = false;
                    action.error = error;
                    removeListeners();
                    return next(action);
                });
                break;
            case menuEvents.joinLobby:
                let { id } = action;
                password = action.password;
                removeListeners = () => {
                    socket.off(menuEvents.joinLobbyError);
                    socket.off(lobbyEvents.connection.join);
                }

                socket.emit(menuEvents.joinLobby, id, password);
                socket.on(lobbyEvents.connection.join, members => {
                    action.success = true;
                    action.members = members;

                    removeListeners();
                    return next(action);
                });
                socket.on(menuEvents.joinLobbyError, error => {
                    action.success = false;
                    action.error = error;

                    removeListeners();
                    return next(action);
                });
            case lobbyEvents.connection.leave:
                if (!getState().inLobby) return next(action);
                socket.emit(lobbyEvents.connection.leave);
                return next(action);
            default:
                return next(action);
        }
    };
}

export default socketMiddleware;