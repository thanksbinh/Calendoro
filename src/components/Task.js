import React from "react";

export class Task extends React.Component {
    handleFocus = (event) => event.target.select();

    render() {
        return (
            <div className='task'>
                <input className="taskInput" placeholder="What're you working on?" onFocus={this.handleFocus}/>
            </div>
        )
    }
}