import React from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import moment from 'moment/moment';

// fix this!
let gCalendarRef;

export class Fullcalendar extends React.Component {
    constructor(props) {
        super(props);
        this.calendarRef = props.calendarRef;
        gCalendarRef = this.calendarRef;
    }

    render() {
        let scrollTime = moment().format("HH") + ":00:00";

        return (
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
                    scrollTime={scrollTime}
                    customButtons={{
                        myCustomButton: {
                            text: 'Refresh',
                            click: function() {
                                gCalendarRef.current.getApi().refetchEvents();
                            }
                        }
                    }}
                    headerToolbar={{
                        left: 'myCustomButton',
                        center: 'title',
                    }}
                />
            </div>
        )
    }
}