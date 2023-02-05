import React, { useEffect, useState } from "react";

export function TodayGoal(props) {
    const [todayGoal, setTodayGoal] = useState(0);

    const getTodayGoal = () => {
        console.log("getTodayGoal");

        if (!props.calendarRef.current) {
            console.log('too fast');
            return;
        }
        let calendarApi = props.calendarRef.current.getApi();
        let events = calendarApi.getEvents();
        let timeSum = 0;
        for (let event of events) {
            if (event._instance.range.start.toDateString() !== new Date().toDateString()) continue;
            if (event._def.extendedProps.userId == null) {
                timeSum += event._instance.range.end - event._instance.range.start;
            } else {
                timeSum -= event._instance.range.end - event._instance.range.start;
            }
        }
        setTodayGoal(Math.ceil(timeSum/(30*60*1000)));
    } 

    useEffect(() => {
        setTimeout(() => {
            getTodayGoal();
        }, 2000)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='goal text-center'>
            <div className="d-flex"> 
                Today's remaining: <span className="goalNum ps-1 pe-1">{todayGoal}</span> Reps
                <span className="refresh-goal material-symbols-outlined ps-1" onClick={getTodayGoal}>refresh</span>
            </div>
        </div>
    )
}