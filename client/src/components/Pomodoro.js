import React, { useContext, useEffect, useRef, useState } from "react";
import darlingMp3 from '../assets/sounds/darling.mp3';
import jikangiriMp3 from '../assets/sounds/jikangiri.mp3';
import axios from "axios";
import { getCookie } from "../javascript/cookie";
import AppContext from "../javascript/AppContext";

export function Pomodoro(props) {
    const { state, setState, calendarRef, setting, freezeDoro, setFreezeDoro } = useContext(AppContext);

    const [curTime, setCurTime] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [focusCount, setFocusCount] = useState(0);
    const [bonusTime, setBonusTime] = useState(0);
    const audioRef = useRef();
    const [audioSrc, setAudioSrc] = useState(darlingMp3);

    let timeRemains = getTimeRemains();
    let timeRemainsString = getTimeRemainsFormat(timeRemains);

    useEffect(() => {
        setInterval(() => {
            setCurTime(new Date());
        }, 10)
    }, [])

    useEffect(() => {
        changeTitle(timeRemainsString + " - " + getTask());
        if (timeRemainsString === "00:02") {
            setAudioSrc(darlingMp3);
            playSound();
        }
        if (timeRemainsString === "-59:59") {
            setAudioSrc(jikangiriMp3);
            playSound();

            setFreezeDoro(true);
            setTimeout(() => {
                setFreezeDoro(false);
                onEnd();
            }, 4000)
        }
    }, [timeRemainsString]) // eslint-disable-line react-hooks/exhaustive-deps

    function playSound() {
        if (audioRef.current.readyState === 4) {
            audioRef.current.load();
            audioRef.current.play();
        }
    }

    function getTask() {
        let taskInput = document.querySelector('.taskInput').value;
        return taskInput ? taskInput : "Calendoro"
    }

    function changeTitle(newTitle) {
        document.title = newTitle;
    }

    // Sent nothing if not logged in
    async function updateHistory() {
        if (state !== "Focus") return;
        if (curTime - startTime <= 5 * 60 * 1000) return;

        let object = {
            "userId": getCookie("profile") ? JSON.parse(getCookie("profile")).id : "",
            "start": startTime,
            "end": curTime,
            "title": getTask()
        };

        // Push this object to local history
        if (!localStorage.getItem("history")) {
            const objectStr = JSON.stringify(object);
            localStorage.setItem("history", JSON.stringify([objectStr]))
        } else {
            const history = JSON.parse(localStorage.getItem("history"));
            const objectStr = JSON.stringify(object);

            localStorage.setItem("history", JSON.stringify([objectStr, ...history]));
        }

        // Push this object to the database if logged in
        if (getCookie("profile")) {
            const res = await axios.post("http://localhost:3001/post", object);

            if (res) {
                console.log("sent", res);

                const history = JSON.parse(localStorage.getItem("history"));
                localStorage.setItem("history", JSON.stringify(history.slice(1)));
            }

            calendarRef.current.getApi().refetchEvents();
        }
    }

    function checkTask() {
        let taskInputEl = document.querySelector('.taskInput');
        let mainBtnEl = document.querySelector('.main-btn');

        if (taskInputEl.value === '') {
            taskInputEl.focus();
            mainBtnEl.classList.toggle('shake');
            setTimeout(() => {
                mainBtnEl.classList.toggle('shake');
            }, 1000);
            return false;
        }
        return true;
    }

    function onFocus() {
        if (!checkTask()) return;

        setBonusTime(getTimeRemains())

        setStartTime(curTime);
        setState("Focus");
    }

    function onShortBreak() {
        updateHistory();

        setFocusCount(focusCount + 1);
        setBonusTime(-getTimeRemains() / 5);

        setStartTime(curTime);
        setState("Short Break");
    }

    function onLongBreak() {
        updateHistory();

        setFocusCount(0);
        setBonusTime(-getTimeRemains() / 5);

        setStartTime(curTime);
        setState("Long Break");
    }

    function onEnd() {
        updateHistory();

        setFocusCount(0);

        setState("");
    }

    function getTimeRemains() {
        switch (state) {
            case "Focus":
                return setting.focusDur - (curTime - startTime);
            case "Short Break":
                return setting.shortBreakDur - (curTime - startTime) + (bonusTime > 0 ? bonusTime : 0);
            case "Long Break":
                return setting.longBreakDur - (curTime - startTime);
            case "":
                return setting.focusDur;
            default:
                console.log("state invalid");
        };
    }

    function getTimeRemainsFormat(timeRemains) {
        let secondsRemain = Math.floor(timeRemains / 1000);
        let dateObj = new Date(Math.abs(secondsRemain * 1000));

        // let hours = dateObj.getUTCHours();
        let minutes = dateObj.getUTCMinutes();
        let seconds = dateObj.getSeconds();

        return (timeRemains < 0 ? "-" : "")
            // + hours.toString().padStart(2, '0') + ':' 
            + minutes.toString().padStart(2, '0') + ':'
            + seconds.toString().padStart(2, '0');
    }

    return (
        <div className="pomodoro">
            <div className="h-100 d-flex flex-column justify-content-around align-items-center">
                <State active={state}></State>
                <Clock value={freezeDoro ? "00:00" : timeRemainsString}></Clock>
                <div className="d-flex gap-2">
                    {state === "Focus" ?
                        (focusCount + 1 !== setting.maxFocusCount ?
                            <Button click={onShortBreak} value={"Short Break"} /> :
                            <Button click={onLongBreak} value={"Long Break"} />) :
                        <Button click={onFocus} value={"Focus"} addClass={"focus"} />}
                    <Button click={onEnd} value={"End"} />
                </div>
            </div>
            <audio ref={audioRef}>
                <source src={audioSrc} type="audio/mpeg" />
            </audio>
        </div>
    )
}

const State = (props) => {
    return (
        <ul className="list-group list-group-horizontal">
            <li className={"list-group-item" + (props.active === "Focus" ? " active" : "")}> Focus </li>
            <li className={"list-group-item" + (props.active === "Short Break" ? " active" : "")}> Short Break </li>
            <li className={"list-group-item" + (props.active === "Long Break" ? " active" : "")}> Long Break </li>
        </ul>
    )
}

const Clock = (props) => {
    return (
        <div className="time-remains display-1"> {props.value} </div>
    )
}

const Button = (props) => {
    const classList = "main-btn btn btn-light btn-lg px-5" + (props.addClass ? " " + props.addClass : "");

    return (
        <button className={classList} onClick={props.click}> {props.value} </button>
    )
}
