import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import useSound from 'use-sound';
import toneSound from '../assets/sounds/tone.wav';
import axios from "axios";
import { getCookie } from "./Cookie";

export function Pomodoro(props) {
    const [state, setState] = useState("");
    const [curTime, setCurTime] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [focusCount, setFocusCount] = useState(0);
    const [play] = useSound(toneSound, { volume: 0.6 });
    const [bonusTime, setBonusTime] = useState(0);

    let timeRemains = getTimeRemains();
    let timeRemainsString = getTimeRemainsFormat(timeRemains);

    useEffect(() => {
        setInterval(() => {
            setCurTime(new Date());
        }, 10)
    }, [])

    useEffect(() => {
        switch (state) {
            case "Focus":
            case "":
                document.querySelector(':root').style.setProperty('--color-main', 'rgba(191,53,51,1)');
                break;
            default:
                document.querySelector(':root').style.setProperty('--color-main', 'rgba(29,117,183,1)');
        };
        props.passState(state);
    }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        changeTitle(timeRemainsString + " - " + getTask());
        if (timeRemainsString === "00:00") {
            play();
        }
    }, [timeRemainsString, play])

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
        if (curTime - startTime <= 5*60*1000) return;

        if (!getCookie("profile")) return;
        let object = {
            "userId": JSON.parse(getCookie("profile")).id,
            "start": startTime,
            "end": curTime,
            "title": getTask()
        };
        await axios.post("http://localhost:3001/post", object);
        console.log("sent", object);
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
                return props.setting.focusDur - (curTime - startTime);
            case "Short Break":
                return props.setting.shortBreakDur - (curTime - startTime) + (bonusTime > 0 ? bonusTime : 0);
            case "Long Break":
                return props.setting.longBreakDur - (curTime - startTime);
            default:
                return props.setting.focusDur;
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
                <Clock value={timeRemainsString}></Clock>
                <div className="d-flex gap-2">
                    {state === "Focus" ?
                        (focusCount + 1 !== props.setting.maxFocusCount ?
                            <Button click={onShortBreak} value={"Short Break"} /> :
                            <Button click={onLongBreak} value={"Long Break"} />) :
                        <Button click={onFocus} value={"Focus"} addClass={"focus"} />}
                    <Button click={onEnd} value={"End"} />
                </div>
            </div>
        </div>
    )
}

Pomodoro.protoType = {
    focusDur: PropTypes.number.isRequired,
    shortBreakDur: PropTypes.number.isRequired,
    longBreakDur: PropTypes.number.isRequired,
    maxFocusCount: PropTypes.number.isRequired,
}

const State = (props) => {
    let elements = []

    for (let state of ["Focus", "Short Break", "Long Break"]) {
        if (state === props.active)
            elements.push(<li className="list-group-item active" key={state}> {state} </li>)
        else
            elements.push(<li className="list-group-item" key={state}> {state} </li>)
    }

    return (
        <ul className="list-group list-group-horizontal">
            {elements.map((el) => el)}
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
