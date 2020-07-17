import React from 'react'
import './css/button.css'

const Button = (props) => {
    const styles = {};
    if (props.width) {
        styles.width = props.width + 'px';
    }

    return (
        <div id={props.id} style={styles} className="app-button" onClick={props.clickAction}>
            {props.text}
        </div>
    )
}


export default Button;