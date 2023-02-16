import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Pomodoro } from './components/Pomodoro';
import { Fullcalendar } from './components/Fullcalendar';
import { Task } from './components/Task';
import { TodayGoal } from './components/TodayGoal';
import { Reminder } from './components/Reminder';

export function App() {
    const [state, setState] = useState('');
    const [setting, setSetting] = useState({
        focusDur: 25 * 60 * 1000,
        shortBreakDur: 5 * 60 * 1000,
        longBreakDur: 15 * 60 * 1000,
        maxFocusCount: 4,
    });
    const calendarRef = React.createRef();

    useEffect(() => {
        console.log("calendarRef changed")
    }, [calendarRef])

    function passState(state) {
        setState(state);
    };

    useEffect(() => {
        switch (state) {
            case "Focus":
            case "":
                document.querySelector(':root').style.setProperty('--color-main', 'rgba(191,53,51,1)');
                break;
            default:
                document.querySelector(':root').style.setProperty('--color-main', 'rgba(29,117,183,1)');
        };
    }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="background-container container-fluid text-white">
            <div className="d-flex justify-content-center">
                <Navbar calendarRef={calendarRef} setSetting={setSetting} />
            </div>
            <div className="d-flex justify-content-center">
                <TodayGoal calendarRef={calendarRef}/>
            </div>
            <div className="d-flex justify-content-center">
                <Fullcalendar calendarRef={calendarRef} />
            </div>
            <div className="row main-content">
                <div className="col">

                </div>
                <div className="col d-flex justify-content-center">
                    <Pomodoro setting={setting} passState={passState} />
                </div>
                <div className='col'>
                    {state.includes("Break") ? <Reminder/> : ""}
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <Task isDisabled={state === "Focus"} />
            </div>
        </div>
    )
}