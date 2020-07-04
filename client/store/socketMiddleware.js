import io from 'socket.io-client';
import { endpoint } from '../../shared/config'

import menuEvents from '../../shared/MenuEventsEnum'
import lobbyEvents from '../../shared/LobbyEventsEnum'

const socketMiddleware = () => {
    const socket = io(endpoint);

    return ({ dispatch, getState }) => next => action => {
        switch (action.type) {
            case menuEvents.createLobby:
                let { maxCapacity, password, name } = action;
                let removeListeners = () => {
                    socket.off(lobbyEvents.connection.created);
                    socket.off(menuEvents.createLobbyError);
                }

                socket.emit(menuEvents.createLobby, name, maxCapacity, password);

                socket.on(lobbyEvents.connection.created, id => {
                    action.success = true;
                    action.id = id;
                    action.admin = socket.id;
                    action.myId = socket.id;
                    removeListeners();

                    setUpListenersForLobby(socket, dispatch);

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
                name = action.name;
                removeListeners = () => {
                    socket.off(menuEvents.joinLobbyError);
                    socket.off(lobbyEvents.connection.join);
                }

                socket.emit(menuEvents.joinLobby, name, id, password);
                socket.on(lobbyEvents.connection.join, (members, admin) => {
                    action.success = true;
                    action.members = members;
                    action.admin = admin;
                    action.myId = socket.id;
                    console.log(action.members);

                    removeListeners();

                    setUpListenersForLobby(socket, dispatch);

                    return next(action);
                });
                socket.on(menuEvents.joinLobbyError, error => {
                    action.success = false;
                    action.error = error;

                    removeListeners();
                    return next(action);
                });
                break;

            case lobbyEvents.connection.leave:
                if (!getState().inLobby) return next(action);
                socket.emit(lobbyEvents.connection.leave);

                //Disable listeners for the lobby we're leaving
                socket.off(lobbyEvents.members.newMember);
                socket.off(lobbyEventsEnum.connection.leave);
                socket.off(lobbyEventsEnum.connection.newAdmin);

                return next(action);

            default:
                return next(action);
        }
    };
}

function setUpListenersForLobby(socket, dispatch) {
    socket.on(lobbyEvents.members.newMember, member => {
        dispatch({ type: lobbyEvents.members.newMember, member: member });
    });

    socket.on(lobbyEvents.members.memberLeft, id => {
        dispatch({ type: lobbyEvents.members.memberLeft, id });
    });

    socket.on(lobbyEvents.connection.newAdmin, id => {
        dispatch({ type: lobbyEvents.connection.newAdmin, id });
    });
}

export default socketMiddleware;