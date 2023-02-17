import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Pomodoro } from './components/Pomodoro';
import { Fullcalendar } from './components/Fullcalendar';
import { Task } from './components/Task';
import { TodayGoal } from './components/TodayGoal';
import { Reminder } from './components/Reminder';
import redBackgroundImg from './assets/images/red-background.jpg';
import blueBackgroundImg from './assets/images/blue-background.jpg';

export function App() {
    const [state, setState] = useState('');
    const [setting, setSetting] = useState({
        focusDur: 25 * 60 * 1000,
        shortBreakDur: 5 * 60 * 1000,
        longBreakDur: 15 * 60 * 1000,
        maxFocusCount: 4,
    });
    const calendarRef = React.createRef();
    const coverImgRef = useRef(null);
    const coverPos = ["translateX(100%)", "translateX(-100%)", "translateY(100%)", "translateY(-100%)"];
    const [freezeDoro, setFreezeDoro] = useState(false);

    useEffect(() => {
        coverImgRef.current.style.backgroundImage = `url(${redBackgroundImg})`;
        coverImgRef.current.style.backgroundImage = `url(${blueBackgroundImg})`;
    }, [])

    useEffect(() => {
        console.log("calendarRef changed")
    }, [calendarRef])

    function passState(state) {
        setState(state);
    };

    useEffect(() => {
        // No cover transition
        if (getComputedStyle(document.querySelector(':root')).getPropertyValue("--color-main").includes("rgba(255,29,67,1)")) {
            if (state === "Focus" || state === "") {
                return;
            }

            coverImgRef.current.style.backgroundImage = `url(${redBackgroundImg})`;
            setTimeout(() => {
                coverImgRef.current.style.backgroundImage = `url(${blueBackgroundImg})`;
            }, 350)
        } else {
            coverImgRef.current.style.backgroundImage = `url(${blueBackgroundImg})`;
            setTimeout(() => {
                coverImgRef.current.style.backgroundImage = `url(${redBackgroundImg})`;
            }, 350)
        }

        let newPosId = Math.floor(Math.random() * 4);
        if (coverPos[newPosId] === coverImgRef.current.style.transform) {
            newPosId = (newPosId + 1) % 4;
        }

        coverImgRef.current.style.transition = `transform 0.35s ease-out`;
        coverImgRef.current.style.transform = "translateX(0)";
        setFreezeDoro(true);

        setTimeout(() => {
            switch (state) {
                case "Focus":
                case "":
                    document.querySelector(':root').style.setProperty('--color-main', 'rgba(255,29,67,1)');
                    break;
                default:
                    document.querySelector(':root').style.setProperty('--color-main', 'rgba(32,120,254,1)');
            };

            coverImgRef.current.style.transform = coverPos[newPosId];
            setFreezeDoro(false);
        }, 700)

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
                    <Pomodoro setting={setting} passState={passState} freezeDoro={freezeDoro}/>
                </div>
                <div className='col'>
                    {state.includes("Break") ? <Reminder/> : ""}
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <Task isDisabled={state === "Focus"} />
            </div>

            <div className='cover-img' ref={coverImgRef}></div>
        </div>
    )
}