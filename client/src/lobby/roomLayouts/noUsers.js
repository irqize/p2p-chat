import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Controls from './controls'
import Notifications from '../../notifications'

import './css/noUsers.css'

import { changePopup } from '../../../store/controls/controlsActions'

const noUsers = (props) => {
    useEffect(() => {
        props.changePopup(true);
    }, [])

    return (
        <div id="no-users-container">
            <div className="ripple-container">
                <span className="ripple r1"></span>
                <span className="ripple r2"></span>
                <span className="ripple r3"></span>
                <span className="ripple r4"></span>
                <span className="ripple r5"></span>
                <span className="ripple r6"></span>
            </div>
            <div id="no-users-message">
                Waiting for other users to connect...
            </div>
            <Controls />
            <Notifications />
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    changePopup: to => dispatch(changePopup(to))
});

export default connect(null, mapDispatchToProps)(noUsers);
