import React, { useEffect, useState } from "react";

export function TodayGoal(props) {
    const [todayGoal, setTodayGoal] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (!props.calendarRef.current) {
                console.log('too fast');
                return;
            }
            let calendarApi = props.calendarRef.current.getApi();
            let events = calendarApi.getEvents();
            let timeSum = 0;
            for (let event of events) {
                // Might take too much time!
                if (event._instance.range.start.toDateString() !== new Date().toDateString()) continue;
                if (event._def.extendedProps.userId == null) {
                    timeSum += event._instance.range.end - event._instance.range.start;
                } else {
                    timeSum -= event._instance.range.end - event._instance.range.start;
                }
            }
            setTodayGoal(Math.ceil(timeSum/(30*60*1000)));
            console.log(events[0])
        }, 2000)
    }, [props])

    return (
        <div className='goal text-center'>
            <div> Today's remaining: <span className="goalNum">{todayGoal}</span> Reps</div>
        </div>
    )
}