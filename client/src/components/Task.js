import React from "react";

export function Task(props) {
    const handleFocus = (event) => event.target.select();

    return (
        <div className='task w-50'>
            <input className="taskInput w-100" placeholder="What're you working on?" onFocus={handleFocus} disabled={props.isDisabled}/>
        </div>
    )
}