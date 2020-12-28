import React from 'react'
import './css/textInput.css'

const TextInput = (props) => {
    if (!props.value)
        return (
            <input id={props.id} style={{ width: props.width + 'px' }} value={props.value} type="text" className="textinput" placeholder={props.placeholder} onChange={props.onChange} />
        )
    else
        return (
            <input id={props.id} value={props.value} style={{ width: props.width + 'px' }} value={props.value} type="text" className="textinput" placeholder={props.placeholder} onChange={props.onChange} />
        )
}

export default TextInput;