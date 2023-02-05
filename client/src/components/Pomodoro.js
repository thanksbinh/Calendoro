import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import useSound from 'use-sound';
import toneSound from '../assets/sounds/tone.wav';
import { Button } from "./Button";
import { State } from "./State";
import { Clock } from "./Clock";
import axios from "axios";

export function Pomodoro(props) {
    const [state, setState] = useState("");
    const [curTime, setCurTime] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [focusCount, setFocusCount] = useState(0);
    const [play] = useSound(toneSound, {volume: 0.8});

    let bonusTime = 0;
    let timeRemains = getTimeRemains();
    let timeRemainsString = getTimeRemainsFormat(timeRemains);

    useEffect(() => {
        setInterval(() => {
            setCurTime(new Date());
        }, 10)
    }, [])

    useEffect(() => {
        props.passState(state);
    }, [props, state])

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

    async function updateHistory() {
        if (curTime - startTime <= 5*60*1000) return;

        let object = {  "userId": 2,
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

        bonusTime = getTimeRemains();

        setStartTime(curTime);
        setState("Focus");
    }

    function onShortBreak() {
        updateHistory();

        setFocusCount(focusCount+1);
        bonusTime = -getTimeRemains() / 5;

        setStartTime(curTime);
        setState("Short Break");
    }

    function onLongBreak() {
        updateHistory();

        setFocusCount(0);
        bonusTime = -getTimeRemains() / 5;

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
                return props.focusDur - (curTime - startTime);
            case "Short Break":
                return props.shortBreakDur - (curTime - startTime) + bonusTime;
            case "Long Break":
                return props.longBreakDur - (curTime - startTime) + bonusTime;
            default:
                return props.focusDur;
        };
    }

    function getTimeRemainsFormat(timeRemains) {
        let secondsRemain = Math.floor(timeRemains/1000);
        let dateObj = new Date(Math.abs(secondsRemain*1000));

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
                <State states={["Focus", "Short Break", "Long Break"]} active={state}></State>
                <Clock value={timeRemainsString}></Clock>
                <div className="d-flex gap-2">
                    {state === "Focus" ? 
                        (focusCount+1 !== props.maxFocusCount ? 
                            <Button click={onShortBreak} value={"Short Break"}/> : 
                            <Button click={onLongBreak} value={"Long Break"}/>) :
                        <Button click={onFocus} value={"Focus"} addClass={"focus"}/>}
                    <Button click={onEnd} value={"End"}/>
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