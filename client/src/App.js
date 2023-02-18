import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Pomodoro } from './components/Pomodoro';
import { Fullcalendar } from './components/Fullcalendar';
import { Task } from './components/Task';
import { TodayGoal } from './components/TodayGoal';
import { Reminder } from './components/Reminder';
import redBackgroundImg from './assets/images/red-background.jpg';
import blueBackgroundImg from './assets/images/blue-background.jpg';
import AppContext from './javascript/AppContext';

export function App() {
    const [state, setState] = useState('');
    const calendarRef = useRef(null);
    const [setting, setSetting] = useState({
        focusDur: 25 * 60 * 1000,
        shortBreakDur: 5 * 60 * 1000,
        longBreakDur: 15 * 60 * 1000,
        maxFocusCount: 4,
    });

    const coverImgRef = useRef(null);
    const [freezeDoro, setFreezeDoro] = useState(false);
    const [cover, setCover] = useState(redBackgroundImg);

    useEffect(() => {
        setCover(blueBackgroundImg);
        setTimeout(() => {
            setCover(redBackgroundImg);
        }, 350)
    }, [])

    useEffect(() => {
        console.log("calendarRef changed")
    }, [calendarRef])

    function passState(state) {
        setState(state);
    };

    function getNewCoverPos() {
        const coverPos = ["translateX(100%)", "translateX(-100%)", "translateY(100%)", "translateY(-100%)"];

        return coverPos[Math.floor(Math.random() * 4)];
    }

    useEffect(() => {
        if (getComputedStyle(document.querySelector(':root')).getPropertyValue("--color-main").includes("rgba(255, 29, 67, 1)")) {
            if (state === "Focus" || state === "") {
                return;
            }

            setCover(redBackgroundImg);
            setTimeout(() => {
                setCover(blueBackgroundImg);
            }, 350)
        } else {
            setCover(blueBackgroundImg);
            setTimeout(() => {
                setCover(redBackgroundImg);
            }, 350)
        }

        coverImgRef.current.style.transition = `transform 0.35s ease-out`;
        coverImgRef.current.style.transform = "translateX(0)";
        setFreezeDoro(true);

        setTimeout(() => {
            switch (state) {
                case "Focus":
                case "":
                    document.querySelector(':root').style.setProperty('--color-main', 'rgba(255, 29, 67, 1)');
                    break;
                default:
                    document.querySelector(':root').style.setProperty('--color-main', 'rgba(32, 120, 254, 1)');
            };

            coverImgRef.current.style.transform = getNewCoverPos();
            setFreezeDoro(false);
        }, 700)

    }, [state])

    return (
        <AppContext.Provider value={{
            state,
            setState,
            calendarRef,
            setting,
            setSetting
        }}>
            <div className="background-container container-fluid text-white">
                <div className="d-flex justify-content-center">
                    <Navbar />
                </div>
                <div className="d-flex justify-content-center">
                    <TodayGoal />
                </div>
                <div className="d-flex justify-content-center">
                    <Fullcalendar />
                </div>
                <div className="row main-content">
                    <div className="col">

                    </div>
                    <div className="col d-flex justify-content-center">
                        <Pomodoro setting={setting} passState={passState} freezeDoro={freezeDoro} />
                    </div>
                    <div className='col'>
                        {state.includes("Break") ? <Reminder /> : ""}
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Task isDisabled={state === "Focus"} />
                </div>

                <div className='cover-img' ref={coverImgRef} style={{ backgroundImage: `url("${cover}")` }}></div>
            </div>
        </AppContext.Provider>
    )
}