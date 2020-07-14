import lobbyEvents from '../../shared/LobbyEventsEnum'
import menuEvents from '../../shared/MenuEventsEnum'

export const createLobbyAction = (name, maxCapacity, password = null) => ({
    type: menuEvents.createLobby,
    maxCapacity,
    password,
    name
});

export const joinLobbyAction = (name, id, password = null) => ({
    type: menuEvents.joinLobby,
    id,
    password,
    name
});

export const leaveLobbyAction = () => ({
    type: lobbyEvents.connection.leave
})

export const requestStreamAction = stream => ({
    type: menuEvents.requestStream,
    stream
});