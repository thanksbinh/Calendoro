import React from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

export function Fullcalendar(props) {
    const scrollTime = (new Date().getHours() - 2).toString().padStart(2, '0') + ":00:00";
    
    function refresh() {
        props.calendarRef.current.getApi().refetchEvents();
    }

    return (
        <div>
            <FullCalendar
                plugins={[ timeGridPlugin, googleCalendarPlugin ]}
                ref={props.calendarRef}
                initialView="timeGridWeek"
                googleCalendarApiKey='AIzaSyBIhX1U9MrmqfpYT_GDGTcS6cEZh3jzpDY'
                eventSources={[
                    {googleCalendarId: 'adulii4v76p76cupo4ccdctvj0@group.calendar.google.com', color: 'rgba(255, 255, 255, 0.1)'},
                    {events: async function() {
                        const res = await axios.get("http://localhost:3001/post");
                        return res.data;
                    }, color: 'rgba(0, 0, 0, 0.1)'}
                ]}
                nowIndicator={true}
                allDaySlot={false}
                scrollTime={scrollTime}
                customButtons={{
                    myCustomButton: {
                        text: 'Refresh',
                        click: refresh.bind(this)
                    }
                }}
                headerToolbar={{
                    left: 'myCustomButton',
                    center: 'title',
                }}
                aspectRatio={2.7}
                firstDay={1}
                slotEventOverlap={false}
            />
        </div>
    )
}