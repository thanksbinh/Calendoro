import React from "react";

export class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curTime: new Date(),
            start: new Date(),
            isRunning: false,
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                curTime : new Date()
            })
        }, 1)
    }

    onStartTimer() {
        this.setState({
            start: this.state.curTime,
            isRunning: !this.state.isRunning,
        })
    }

    render() {
        return (
            <div className="container">
                <div className="timer">
                    <p>Now: {this.state.curTime.toLocaleString()}</p>
                </div>
            </div>
        )
    }
}