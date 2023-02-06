import React from "react";
import { TodayGoal } from "./TodayGoal";
import { Login } from "./Login";

export function Navbar(props) {
    function onToggleCalendar() {
        document.querySelector('.fullcalendar').classList.toggle('show');
        document.querySelector('.toggle-calendar-btn').classList.toggle('btn-select');
    }

    function onToggleSetting() {
        
    }

    return (
        <div className="navbar d-flex justify-content-between w-50">
            <div className="logo-container flex-item">
                <a href="http://localhost:3000/" className="logo d-flex">
                    <span className="material-symbols-outlined">check_circle</span>
                    <h2>Calendoro</h2>
                </a>
            </div>

            <div className="d-flex justify-content-center flex-item">
                <TodayGoal calendarRef={props.calendarRef}/>
            </div>
            
            <div className="tools flex-item d-flex justify-content-end align-items-center h-100">
                <span className="material-symbols-outlined toggle-calendar-btn p-2" onClick={onToggleCalendar}>event</span>
                <span className="material-symbols-outlined setting-btn p-2" onClick={onToggleSetting}>settings</span>
                <Login />
            </div>
        </div>
    )
}