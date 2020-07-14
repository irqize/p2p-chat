import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import './index.css'

const Notifications = (props) => {
    const notificationList = props.notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.isError ? 'error' : ''}`}>{notification.content}</div>
    ));

    return (
        <div id="notifications">
            {notificationList}
        </div>
    )
}

const mapStateToProps = (state) => ({
    notifications: state.notifications.notifications
})

export default connect(mapStateToProps, null)(Notifications);