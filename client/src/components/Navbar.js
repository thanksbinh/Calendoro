import React, { useState } from "react";
import { Login } from "./Login";
import { Setting } from "./Setting";
import CalendarContext from '../javascript/CalendarContext';
import { getCookie } from "../javascript/cookie";
import axios from 'axios';

export function Navbar(props) {
    const [calendarList, setCalendarList] = useState([]);
    const [calendarSelectMode, setCalendarSelectMode] = useState(false);
    const [selectedCalendarIdList, selectCalendarIdList] = useState(getCookie("selectedCalendarId") ? getCookie("selectedCalendarId").split(",") : []);

    function onToggleCalendar() {
        document.querySelector('.fullcalendar').classList.toggle('show');
        document.querySelector('.toggle-calendar-btn').classList.toggle('btn-select');
    }

    async function updateCalendar() {
        if (!getCookie("user")) return;
        
        const res = await axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(getCookie("user")).access_token}`,
                Accept: 'application/json'
            }
        });
        res.data.items.sort((a, b) => a.summary.localeCompare(b.summary));
        setCalendarList(res.data.items);
        setCalendarSelectMode(true);
    }

    return (
        <CalendarContext.Provider value={{
            calendarList,
            setCalendarList,
            calendarSelectMode,
            setCalendarSelectMode,
            selectedCalendarIdList,
            selectCalendarIdList,
            updateCalendar
        }}>
            <div className="navbar d-flex justify-content-between w-50">
                <div className="logo-container">
                    <a href="http://localhost:3000/" className="logo d-flex">
                        <span className="material-symbols-outlined">check_circle</span>
                        <h2>Calendoro</h2>
                    </a>
                </div>

                <div className="tools d-flex justify-content-end align-items-center h-100">
                    <span className="material-symbols-outlined toggle-calendar-btn p-2" onClick={onToggleCalendar}>event</span>
                    <Setting setSetting={props.setSetting} />
                    <Login/>
                </div>
            </div>
        </CalendarContext.Provider>

    )
}