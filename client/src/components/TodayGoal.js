import React from "react";

// Todo: auto get goal after run
export class TodayGoal extends React.Component {
    constructor(props) {
        super(props);
        this.calendarRef = props.calendarRef;
        this.state = {
            todayGoal: 0
        }
    }

    getTodayGoal() {
        let calendarApi = this.calendarRef.current.getApi();
        let events = calendarApi.getEvents();
        let timeSum = 0;
        for (let event of events) {
            if (event._instance.range.start.toDateString() !== new Date().toDateString()) continue;
            timeSum += event._instance.range.end - event._instance.range.start;
        }

        this.setState({
            todayGoal: Math.ceil(timeSum/(30*60*1000))
        })
    }

    render() {
        return (
            <div className='goal text-center' onClick={()=> this.getTodayGoal()}>
                <div> Today's remaining: <span className="goalNum">{this.state.todayGoal}</span> Reps</div>
            </div>
        )
    }
}