import React from 'react'
import './css/textinput.css'

const TextInput = (props) => {
    return (
        <input id={props.id} style={{ width: props.width + 'px' }} value={props.value} type="text" className="textinput" placeholder={props.placeholder} onChange={props.onChange} />
    )
}

export default TextInput;