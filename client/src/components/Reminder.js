import React, { useState } from "react";

export function Reminder(props) {
    const [sideQuests, setSideQuests] = useState(["Look outside", "Stand up", "Exercise"]);

    // Todo: handle event check, congrat and hide component when done all
    // Might-do: Timer for few quests, add time criteria (exercise after 2h)

    return (
        props.state === "Short Break" || props.state === "Long Break" ? 
        <div className="reminder">
            <legend className="legend-checkbox">Side-quests: </legend>
            <div className="input-checkbox">
                {sideQuests.map((quest, i) => (
                    <div className="form-check" key={i}>
                        <input className="form-check-input" type="checkbox" value="" id={"check"+i}/>
                        <label className="form-check-label" htmlFor={"check"+i}>{quest}</label>
                    </div>
                    )
                )}
            </div>
        </div> 
        : null
    )
}