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
                    return next(action);
                });
                socket.on(menuEvents.createLobbyError, error => {
                    action.success = false;
                    action.error = error;
                    removeListeners();
                    return next(action);
                });


                socket.on(lobbyEvents.members.newMember, member => {
                    dispatch({ type: lobbyEvents.members.newMember, member: member });
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

                    socket.on(lobbyEvents.members.newMember, member => {
                        dispatch({ type: lobbyEvents.members.newMember, member: member });
                    });

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
                socket.off(lobbyEvents.members.newMember);
                return next(action);
            default:
                return next(action);
        }
    };
}

export default socketMiddleware;