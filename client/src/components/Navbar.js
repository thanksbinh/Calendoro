import React, { useRef, useState } from "react";
import { Login } from "./Login";
import { Setting } from "./Setting";
import CalendarContext from '../javascript/CalendarContext';
import { getCookie } from "../javascript/cookie";
import axios from 'axios';
import darlingOhayoMp3 from '../assets/sounds/darlingOhayo.mp3';

export function Navbar() {
    const [calendarList, setCalendarList] = useState([]);
    const [calendarSelectMode, setCalendarSelectMode] = useState(false);
    const [selectedCalendarIdList, selectCalendarIdList] = useState(getCookie("selectedCalendarId") ? getCookie("selectedCalendarId").split(",") : []);
    const audioRef = useRef(null);
    const audioSrc = darlingOhayoMp3;

    function onToggleCalendar() {
        document.querySelector('.fullcalendar').classList.toggle('show');
        document.querySelector('.toggle-calendar-btn').classList.toggle('btn-select');
    }

    async function updateCalendar(access_token) {
        try {
            const res = await axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                }
            });
            res.data.items.sort((a, b) => a.summary.localeCompare(b.summary));
            setCalendarList(res.data.items);
            setCalendarSelectMode(true);
        } catch (error) {
            console.log('Access_token outdated');
            throw error
        }
    }

    function onClickLogo() {
        if (audioRef.current.readyState >= 2) {
            audioRef.current.load();
            audioRef.current.play();
        }
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
                <div className="logo-container" onClick={onClickLogo}>
                    <button className="logo d-flex">
                        <span className="material-symbols-outlined">check_circle</span>
                        <h2>Calendoro</h2>
                    </button>
                    <audio ref={audioRef}>
                        <source src={audioSrc} type="audio/mpeg" />
                    </audio>
                </div>

                <div className="tools d-flex justify-content-end align-items-center h-100">
                    <span className="material-symbols-outlined toggle-calendar-btn p-2" onClick={onToggleCalendar}>event</span>
                    <Setting />
                    <Login />
                </div>
            </div>
        </CalendarContext.Provider>
    )
}

