import React from 'react';
import { Navbar } from './components/Navbar';
import { Pomodoro } from './components/Pomodoro';
import { Fullcalendar } from './components/Fullcalendar';
import { TodayGoal } from './components/TodayGoal';
import { Task } from './components/Task';

export class App extends React.Component {
    calendarRef = React.createRef()

    render() {
        return (
            <div className="container-fluid text-white">
                <div className="d-flex justify-content-start">
                    <Navbar/>
                </div>
                <div className="d-flex justify-content-center">
                    <TodayGoal calendarRef={this.calendarRef}/>
                </div>
                <details>
                    <summary> Calendar </summary>
                    <div className='fullcalendar'>
                        <Fullcalendar calendarRef={this.calendarRef}/>
                    </div>
                </details>
                <div className="d-flex justify-content-center">
                    <Pomodoro/>
                </div>
                <div className="d-flex justify-content-center">
                    <Task/>
                </div>
            </div>
        )
    }
}