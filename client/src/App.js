import React from 'react';
import { Navbar } from './components/Navbar';
import { Pomodoro } from './components/Pomodoro';
import { Fullcalendar } from './components/Fullcalendar';
import { Task } from './components/Task';

export class App extends React.Component {
    calendarRef = React.createRef()

    render() {
        return (
            <div className="container-fluid text-white">
                <div className="d-flex justify-content-center">
                    <Navbar calendarRef={this.calendarRef}/>
                </div>
                <div className='fullcalendar'>
                    <Fullcalendar calendarRef={this.calendarRef}/>
                </div>
                
                <div className="d-flex justify-content-center">
                    <Pomodoro/>
                </div>
                <div className="d-flex justify-content-center">
                    <Task/>
                </div>
                <div className="d-flex justify-content-center pb-5 d-none">
                    <form action="../../post" method="post" className="form">
                        <button type="submit">Connected?</button>
                    </form>
                </div>
            </div>
        )
    }
}