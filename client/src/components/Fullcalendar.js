import React, { useContext } from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import key from "../assets/key/key";
import AppContext from "../javascript/AppContext";

export function Fullcalendar() {
    const { calendarRef } = useContext(AppContext);

    function refresh() {
        calendarRef.current.getApi().refetchEvents();
    }

    return (
        <div className='fullcalendar'>
            <FullCalendar
                plugins={[ timeGridPlugin, googleCalendarPlugin ]}
                ref={calendarRef}
                initialView="timeGridWeek"
                googleCalendarApiKey={key.googleCalendarApiKey} 
                nowIndicator={true}
                allDaySlot={false}
                scrollTime={(new Date().getHours() - 2).toString().padStart(2, '0') + ":00:00"}
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