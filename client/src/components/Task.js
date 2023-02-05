import React from "react";

export function Task(props) {
    const handleFocus = (event) => event.target.select();
    const handleEnter = (event) => {
        if (event.key === "Enter") {
            document.querySelector(".main-btn.focus").click();
        }
    }

    return (
        <div className='task w-50'>
            <input className="taskInput w-100" placeholder="What're you working on?" onFocus={handleFocus} onKeyDown={handleEnter} disabled={props.isDisabled}/>
        </div>
    )
}