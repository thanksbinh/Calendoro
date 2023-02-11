import React from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import key from "../assets/key/key";

export function Fullcalendar(props) {
    const scrollTime = (new Date().getHours() - 2).toString().padStart(2, '0') + ":00:00";
    
    function refresh() {
        props.calendarRef.current.getApi().refetchEvents();
    }

    return (
        <div className='fullcalendar'>
            <FullCalendar
                plugins={[ timeGridPlugin, googleCalendarPlugin ]}
                ref={props.calendarRef}
                initialView="timeGridWeek"
                googleCalendarApiKey={key.googleCalendarApiKey}
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
                aspectRatio={2.5}
                firstDay={1}
                slotEventOverlap={false}
                eventMinHeight={1}
            />
        </div>
    )
}