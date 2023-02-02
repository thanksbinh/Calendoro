import React from "react";

export class Task extends React.Component {
    handleFocus = (event) => event.target.select();

    render() {
        return (
            <div className='task w-50'>
                <input className="taskInput w-100" placeholder="What're you working on?" onFocus={this.handleFocus}/>
            </div>
        )
    }
}