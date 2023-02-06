import React from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export function CalendarSelect(props) {
    return (
        <Popup open={props.open} modal>
            <legend className="legend-checkbox">Select calendar(s) to display </legend>
            <div className="input-checkbox">
                {props.calendarList.map((calendar, i) => {
                    return (
                        <div className="form-check" key={i}>
                            <input className="form-check-input" type="checkbox" value="" id={"check"+i}/>
                            <label className="form-check-label" htmlFor={"check"+i}>
                                {calendar.summary}
                            </label>
                        </div>
                    )
                })}
            </div>
            <button className="btn btn-primary" onClick={() => props.setOpen(false)}>Confirm</button>
        </Popup>
    )
} 