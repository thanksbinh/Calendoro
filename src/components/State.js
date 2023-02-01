import React from "react";

export const State = (props) => {
    let elements = []
    for (let state of props.states) {
        if (state === props.active) 
            elements.push(<li className="list-group-item active" key={state}> {state} </li>)
        else 
            elements.push(<li className="list-group-item" key={state}> {state} </li>)
    }

    return (
        <ul className="list-group list-group-horizontal">
            {elements.map((el) => el)}
        </ul>
    )
}