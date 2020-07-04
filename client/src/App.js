import React from 'react'
import { connect } from 'react-redux'
import Lobby from './lobby'
import JoinScreen from './joinScreen'

const App = (props) => {
    const CurrentView = props.inLobby ? Lobby : JoinScreen;
    return (
        <>
            <CurrentView />
        </>
    )
}

function mapStateToProps(state) {
    const { inLobby } = state;
    return { inLobby };
}



export default connect(mapStateToProps, null)(App);