import React, { useEffect } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

export function Fullcalendar(props) {
    const scrollTime = (new Date().getHours() - 2).toString().padStart(2, '0') + ":00:00";

    useEffect(() => {
        props.calendarIdList.forEach(id => {
            console.log(id)
            props.calendarRef.current.getApi().addEventSource({
                googleCalendarId: id, 
                color: 'rgba(255, 255, 255, 0.1)'
            });
        })
    }, [props])
    
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
                    {events: async function() {
                        try {
                            const res = await axios.get("http://localhost:3001/post");
                            return res.data;
                        } catch (error) {
                           console.log("Fullcalendar error", error);
                           return {}; 
                        }
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
                eventMinHeight={1}
            />
        </div>
    )
}