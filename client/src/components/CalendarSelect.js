import React, { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { setCookie, getCookie } from './Cookie';

export function CalendarSelect(props) {
    const [selectedCalendarIdList, selectCalendarIdList] = useState(getCookie("selectedCalendarId") ? getCookie("selectedCalendarId").split(",") : []);
    
    useEffect(() => {
        onSubmit();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = () =>  {
        selectedCalendarIdList.forEach(id => {
            if (id) props.calendarRef.current.getApi().addEventSource({
                googleCalendarId: id, 
                color: 'rgba(255, 255, 255, 0.1)'
            });
        })
        setCookie("selectedCalendarId", selectedCalendarIdList, 30);
    }

    const handleOnChange = (i) => {
        if (selectedCalendarIdList.includes(props.calendarList[i].id)) {
            selectCalendarIdList(selectedCalendarIdList.filter(item => item !== props.calendarList[i].id))
        } else {
            selectCalendarIdList([...selectedCalendarIdList, props.calendarList[i].id]);
        }
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