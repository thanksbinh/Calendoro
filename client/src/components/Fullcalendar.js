import React from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

export class Fullcalendar extends React.Component {
    constructor(props) {
        super(props);
        this.calendarRef = props.calendarRef;
    }

    refresh() {
        this.calendarRef.current.getApi().refetchEvents();
    }

    render() {
        let scrollTime = (new Date().getHours() - 2).toString().padStart(2, '0') + ":00:00";

        return (
            <div>
                <FullCalendar
                    plugins={[ timeGridPlugin, googleCalendarPlugin ]}
                    ref={this.calendarRef}
                    initialView="timeGridWeek"
                    googleCalendarApiKey='AIzaSyBIhX1U9MrmqfpYT_GDGTcS6cEZh3jzpDY'
                    eventSources={[
                        {googleCalendarId: 'adulii4v76p76cupo4ccdctvj0@group.calendar.google.com', color: 'rgba(255, 255, 255, 0.1)'}
                    ]}
                    nowIndicator={true}
                    allDaySlot={false}
                    scrollTime={scrollTime}
                    customButtons={{
                        myCustomButton: {
                            text: 'Refresh',
                            click: this.refresh.bind(this)
                        }
                    }}
                    headerToolbar={{
                        left: 'myCustomButton',
                        center: 'title',
                    }}
                    aspectRatio={2.7}
                    firstDay={1}
                />
            </div>
        )
    }
}