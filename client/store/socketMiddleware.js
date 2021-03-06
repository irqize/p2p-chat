import io from 'socket.io-client';
import { endpoint } from '../../shared/config'

import menuEvents from '../../shared/MenuEventsEnum'
import lobbyEvents from '../../shared/LobbyEventsEnum'
import controlsActions from './controls/controlsActionTypes'

const socketMiddleware = () => {
    const socket = io(endpoint);

    return ({ dispatch, getState }) => next => action => {
        let removeListeners, password, name;
        switch (action.type) {
            case menuEvents.createLobby:
                let { maxCapacity } = action;
                password = action.password;
                name = action.name;
                removeListeners = () => {
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

                    setUpListenersForLobby(socket, dispatch, getState);

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
                removeListeners = () => {
                    socket.off(menuEvents.joinLobbyError);
                    socket.off(lobbyEvents.connection.join);
                }

                socket.emit(menuEvents.joinLobby, action.name, id, action.password);
                socket.on(lobbyEvents.connection.join, (members, admin) => {
                    action.success = true;
                    action.members = members;
                    action.admin = admin;
                    action.myId = socket.id;

                    removeListeners();

                    setUpListenersForLobby(socket, dispatch, getState);

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
                socket.emit(lobbyEvents.connection.leave);

                //Disable listeners for the lobby we're leaving
                socket.off(lobbyEvents.members.newMember);
                socket.off(lobbyEvents.connection.leave);
                socket.off(lobbyEvents.connection.newAdmin);

                return next(action);

            case controlsActions.changeMute:
                socket.emit(lobbyEvents.members.changeSilence, action.to)

                return next(action);
            default:
                return next(action);
        }
    };
}

async function setUpListenersForLobby(socket, dispatch, getState) {
    socket.on(lobbyEvents.members.newMember, newMember => {
        dispatch({ type: lobbyEvents.members.newMember, member: newMember });
        getState().main.lobby.members.forEach(member => {
            if (member.id === newMember.id) {
                member.peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        socket.emit(lobbyEvents.peerConnection.gotCandidate, member.id, event.candidate);
                    }
                };
                getState().main.stream.getTracks().forEach(track => {
                    member.peerConnection.addTrack(track);
                });
                member.peerConnection.ontrack = e => {
                    member.mediaStream.addTrack(e.track);
                }
            }
        })
    });

    socket.on(lobbyEvents.members.memberLeft, id => {
        dispatch({ type: lobbyEvents.members.memberLeft, id });
    });

    socket.on(lobbyEvents.connection.newAdmin, id => {
        dispatch({ type: lobbyEvents.connection.newAdmin, id });
    });

    socket.on(lobbyEvents.peerConnection.offerRequested, id => {
        dispatch({ type: lobbyEvents.peerConnection.create, id });
        getState().main.lobby.members.forEach(async member => {
            if (member.id === id) {
                member.peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        socket.emit(lobbyEvents.peerConnection.gotCandidate, member.id, event.candidate);
                    }
                }

                member.peerConnection.ontrack = e => {
                    member.mediaStream.addTrack(e.track);
                }


                getState().main.stream.getTracks().forEach(track => {
                    member.peerConnection.addTrack(track);
                });


                const offer = await member.peerConnection.createOffer();
                await member.peerConnection.setLocalDescription(offer);

                socket.emit(lobbyEvents.peerConnection.gotOffer, id, offer);


            }
        })
    });

    socket.on(lobbyEvents.peerConnection.sendAnswer, (id, answer) => {
        getState().main.lobby.members.forEach(async member => {
            if (member.id === id) {
                await member.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
            }
        })
    });

    socket.on(lobbyEvents.peerConnection.sendCandidate, (id, candidate) => {
        dispatch({ type: lobbyEvents.peerConnection.sendCandidate, id, candidate })
    });

    socket.on(lobbyEvents.members.changeSilence, (id, to) => {
        dispatch({ type: lobbyEvents.members.changeSilence, id, to });
    })

    socket.on(lobbyEvents.peerConnection.sendOffer, (id, offer) => {
        getState().main.lobby.members.forEach(async member => {
            if (member.id === id) {
                member.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                const answer = await member.peerConnection.createAnswer();
                await member.peerConnection.setLocalDescription(answer);

                socket.emit(lobbyEvents.peerConnection.gotAnswer, id, answer);
            }
        })
    })
}

export default socketMiddleware;