import React from 'react'
import { connect } from 'react-redux'
import Lobby from './lobby'
import JoinScreen from './joinScreen'

import './app.css'

const App = (props) => {
    if (props.inLobby) {
        return (<div className="lobbyContainer">
            <Lobby />
        </div>)
    } else {
        if (props.isjoinlink) {
            return (<div className="joinScreenContainer">
                <JoinScreen isjoinlink={1} />
            </div>)
        } else {
            return (<div className="joinScreenContainer">
                <JoinScreen isjoinlink={0} />
            </div>)
        }

    }
}

function mapStateToProps(state) {
    const { inLobby } = state;
    return { inLobby };
}



export default connect(mapStateToProps, null)(App);