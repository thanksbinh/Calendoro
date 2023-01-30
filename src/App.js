import React from 'react';
import { Pomodoro } from './components/Pomodoro';
import { Navbar } from './components/Navbar';
import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

export class App extends React.Component {

    calendarRef = React.createRef()

    getTodayGoal() {
        let calendarApi = this.calendarRef.current.getApi()
        
        let timeSum = 0;
        for (let event of calendarApi.getEvents()) {
            timeSum += event._instance.range.end - event._instance.range.start;
        }
        console.log(calendarApi.getEvents())
        console.log(timeSum/(60*60*1000), 'hours')
        console.log(timeSum/(30*60*1000), 'pomodoros')
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
                    <div className='fullcalendar'>
                        <FullCalendar
                            plugins={[ timeGridPlugin, googleCalendarPlugin ]}
                            ref={this.calendarRef}
                            initialView="timeGridDay"
                            googleCalendarApiKey='AIzaSyBIhX1U9MrmqfpYT_GDGTcS6cEZh3jzpDY'
                            eventSources={[
                                {googleCalendarId: 'adulii4v76p76cupo4ccdctvj0@group.calendar.google.com'}
                            ]}
                            nowIndicator={true}
                            allDaySlot={false}
                        />
                    </div>
                </div>
                <div className='Goal'>
                    <button onClick={this.getTodayGoal.bind(this)}> Click me </button>
                </div>
            </div>
        )
    }
}