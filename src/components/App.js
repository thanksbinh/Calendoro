import React from 'react';
import { Timer } from './Timer';
import { Pomodoro } from './Pomodoro';

let divStyle = {
    height: '240px',
};

export class App extends React.Component {
    render() {
        return (
            <div className="container-fluid bg-danger text-white" style={divStyle}>
                <div className="d-flex justify-content-center">
                    <div className="">
                        <Timer/>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center">
                        <Pomodoro/>
                    </div>
                </div>
            </div>
        )
    }
}