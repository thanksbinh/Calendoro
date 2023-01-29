import React from 'react';
import { Pomodoro } from './components/Pomodoro';
import { Navbar } from './components/Navbar';

export class App extends React.Component {
    render() {
        return (
            <div className="container-fluid text-white">
                <div className="d-flex justify-content-start">
                    <Navbar/>
                </div>
                <div className="d-flex justify-content-center">
                    <Pomodoro/>
                </div>
            </div>
        )
    }
}