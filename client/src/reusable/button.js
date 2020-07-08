import React from 'react'
import './css/button.css'

const Button = (props) => {
    return (
        <div id={props.id} className="app-button" onClick={props.clickAction}>
            <div className="app-button-background"> </div>
            <div className="app-button-foreground">
                {props.text}
            </div>
        </div>
    )
}


export default Button;