import React, { useContext } from "react";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import key from "../assets/key/key";
import AppContext from "../javascript/AppContext";
import axios from "axios";
import { getCookie } from "../javascript/cookie";

export function Fullcalendar() {
    const { calendarRef } = useContext(AppContext);

    function refresh() {
        // Push local history to the database if logged in
        if (getCookie("profile") && localStorage.getItem("history")) {
            const localHistory = JSON.parse(localStorage.getItem("history")); 
            localHistory.forEach(async str => {
                const object = JSON.parse(str);
                if (!object.userId) {
                    object.userId = JSON.parse(getCookie("profile")).id;
                }

                const res = await axios.post("http://localhost:3001/post", object);

                if (res) {
                    console.log("sent", res);
                    const history = JSON.parse(localStorage.getItem("history")); 
                    localStorage.setItem("history", JSON.stringify(history.slice(1)));
                }
            })
        }

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