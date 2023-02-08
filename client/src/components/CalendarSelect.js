import React, { useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export function CalendarSelect(props) {
    const [selectedCalendarIdList, selectCalendarIdList] = useState([]);

    function onSubmit() {
        props.setCalendarIdList(selectedCalendarIdList);
    }

    const handleOnChange = (i) => {
        console.log("add", props.calendarList[i].summary, props.calendarList[i].id);
        selectCalendarIdList([...selectedCalendarIdList, props.calendarList[i].id]);
    }

    return (
        <Popup open={props.open} modal>
            <legend className="legend-checkbox">Select calendar(s) to display </legend>
            <div className="input-checkbox">
                {props.calendarList.map((calendar, i) => {
                    return (
                        <div className="form-check" key={i}>
                            <input className="form-check-input" type="checkbox" value="" id={"check"+i} onChange={() => handleOnChange(i)}/>
                            <label className="form-check-label" htmlFor={"check"+i}>
                                {calendar.summary}
                            </label>
                        </div>
                    )
                })}
            </div>
            <button className="btn btn-primary" onClick={() => {props.setOpen(false); onSubmit();}}>Submit</button>
        </Popup>
    )
} 