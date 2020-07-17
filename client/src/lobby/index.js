import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import NoUsers from './roomLayouts/noUsers'
import OneUser from './roomLayouts/oneUser'
import ManyUsers from './roomLayouts/manyUsers'

import { switchMute } from '../../store/actions'

const Lobby = props => {

    if (props.lobby.members.length === 0) return <NoUsers />;
    if (props.lobby.members.length === 1) return <OneUser />
    if (props.lobby.members.length > 1) return <ManyUsers />;
}

const mapStateToProps = state => {
    return {
        lobby: state.main.lobby,
        controls: state.main.controls
    }
}


const mapDispatchToProps = dispatch => ({
    switchMute: member => dispatch(switchMute(member))
})

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);