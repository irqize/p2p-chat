import React from 'react'
import { connect } from 'react-redux'
import lobbyEvents from '../../../shared/LobbyEventsEnum'

const Lobby = props => {
    return (
        <div>
            {props.lobby.id}
            <button onClick={props.leave}>Leave lobby</button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lobby: state.lobby
    }
}

const mapDispatchToProps = dispatch => {
    return {
        leave: () => dispatch({ type: lobbyEvents.connection.leave })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);