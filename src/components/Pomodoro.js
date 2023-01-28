import React from "react";
import { Button } from "./Button";
import { State } from "./State";

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
        let object = {  "Start": this.state.startTime, 
                        "Durration": this.state.curTime - this.state.startTime, 
                        "State": this.state.state
                    }; 
        this.state.history.push(object);

        console.log(this.state.history);
    }

    onFocus() {
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

        let hours = dateObj.getUTCHours();
        let minutes = dateObj.getUTCMinutes();
        let seconds = dateObj.getSeconds();
        
        return (timeRemains < 0 ? "-" : "") + hours.toString().padStart(2, '0')
            + ':' + minutes.toString().padStart(2, '0')
            + ':' + seconds.toString().padStart(2, '0');
    }

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

    render() {
        let timeRemains = this.getTimeRemains();
        let timeRemainsString = this.getTimeRemainsFormat(timeRemains);

        let button = this.makeButton(this.state.state, timeRemains);

        return (
            <div className="h-100">
                <div className="pomodoro">
                    <State states={["Focus", "Short Break", "Long Break"]} active={this.state.state}></State>
                    <div className="display-1 d-flex justify-content-center"> {timeRemainsString} </div>

                    <div className="d-flex justify-content-center">
                        {button}
                    </div>
                </div>
            </div>
        )
    }
}