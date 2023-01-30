import React from 'react';
import { Navbar } from './components/Navbar';
import { Pomodoro } from './components/Pomodoro';
import { Fullcalendar } from './components/Fullcalendar';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todayGoal: 0
        };
    }

    calendarRef = React.createRef()

    getTodayGoal() {
        let calendarApi = this.calendarRef.current.getApi();
        let events = calendarApi.getEvents();
        
        let timeSum = 0;
        for (let event of events) {
            timeSum += event._instance.range.end - event._instance.range.start;
        }
        console.log(calendarApi.getEvents())
        console.log(timeSum/(60*60*1000), 'hours')
        console.log(timeSum/(30*60*1000), 'pomodoros')
    }

    setState1() {
        this.setState({
            todayGoal: 1
        })
        console.log(this.state.todayGoal)
    }

    render() {
        return (
            <div className="container-fluid text-white">
                <div className="d-flex justify-content-start">
                    <Navbar/>
                </div>
                <div className='content d-flex justify-content-around'>
                    <div className="d-flex justify-content-center">
                        <Pomodoro/>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Fullcalendar calendarRef={this.calendarRef}/>
                    </div>
                </div>
                <div className='goal'>
                    <div> Today's goal: {this.state.todayGoal}</div>
                    <button onClick={this.getTodayGoal.bind(this)}> Click me </button>
                </div>
            </div>
        )
    }
}