import React from "react";
import { Button } from "./Button";
import { State } from "./State";
import { Clock } from "./Clock";

export class Pomodoro extends React.Component {
    constructor(props) {
        super(props);

        let focusDurMin = 25;
        let shortBreakDurMin = 5;
        let longBreakDurMin = 25;

        this.focusCount = 4;
        this.bonusTime = 0;

        this.state = {
            curTime: new Date(),
            startTime: new Date(),

            focusDur: focusDurMin*60*1000,
            shortBreakDur: shortBreakDurMin*60*1000,
            longBreakDur: longBreakDurMin*60*1000,

            state: "",
            history: [],
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                curTime : new Date(),
            })
        }, 1)
    }

    updateHistory() {
        if (this.state.state !== 'Focus') return;

        let task = document.querySelector('.taskInput').value;
        let object = {  "Start": this.state.startTime, 
                        "Durration": this.state.curTime - this.state.startTime, 
                        "Task": task
                    }; 
        this.state.history.push(object);

        console.log(this.state.history);
    }

    checkTask() {
        let taskInputEl = document.querySelector('.taskInput');
        let mainBtnEl = document.querySelector('.main-btn');

        if (taskInputEl.value === '') {
            taskInputEl.focus();
            mainBtnEl.classList.toggle('shake');
            setTimeout(() => {
                mainBtnEl.classList.toggle('shake')
            }, 1000)
            return false;
        }
        return true;
    }

    onFocus() {
        if (!this.checkTask()) return;
        this.updateHistory();

        this.setState({
            startTime: this.state.curTime,
            state: "Focus",
        })
    }

    onShortBreak() {
        this.updateHistory();

        this.focusCount--;

        this.setState({
            startTime: this.state.curTime,
            state: "Short Break",
        })
    }

    onLongBreak() {
        this.updateHistory();

        this.focusCount = 4;

        this.setState({
            startTime: this.state.curTime,
            state: "Long Break",
        })
    }

    onEnd() {
        this.updateHistory();

        this.setState({
            state: "",
        })
    }

    getTimeRemains() {
        switch (this.state.state) {
            case "Focus":
                return this.state.focusDur - (this.state.curTime - this.state.startTime);
            case "Short Break":
                return this.state.shortBreakDur - (this.state.curTime - this.state.startTime);
            case "Long Break":
                return this.state.longBreakDur - (this.state.curTime - this.state.startTime);
            default:
                return 25*60*1000;
        };
    }

    getTimeRemainsFormat(timeRemains) {
        let dateObj = new Date(Math.abs(timeRemains));

        // let hours = dateObj.getUTCHours();
        let minutes = dateObj.getUTCMinutes();
        let seconds = dateObj.getSeconds();
        
        return (timeRemains < 0 ? "-" : "") 
            // + hours.toString().padStart(2, '0') + ':' 
            + minutes.toString().padStart(2, '0') + ':' 
            + seconds.toString().padStart(2, '0');
    }

    // Todo: improve
    makeButton(state, timeRemains) {
        if (state !== "" && timeRemains > 0) {
            return <Button click={this.onEnd.bind(this)} value={"End"}/>
        } else if (state === "") {
            return <Button click={this.onFocus.bind(this)} value={"Focus"}/>
        } else if (state === "Focus") {
            if (this.focusCount > 1) {
                return <Button click={this.onShortBreak.bind(this)} value={"Short Break"}/>
            } else {
                return <Button click={this.onLongBreak.bind(this)} value={"Long Break"}/>
            }
        } else if (state === "Short Break" || state === "Long Break") {
            return <Button click={this.onFocus.bind(this)} value={"Focus"}/>
        }
    }

    changeTitle(newTitle) {
        document.title = newTitle;
    }

    render() {
        let timeRemains = this.getTimeRemains();
        let timeRemainsString = this.getTimeRemainsFormat(timeRemains);
        this.changeTitle(timeRemainsString + " - Calendoro")

        return (
            <div className="pomodoro">
                <div className="h-100 d-flex flex-column justify-content-around align-items-center">
                    <State states={["Focus", "Short Break", "Long Break"]} active={this.state.state}></State>
                    <Clock value={timeRemainsString}></Clock>
                    {this.makeButton(this.state.state, timeRemains)}
                </div>
            </div>
        )
    }
}