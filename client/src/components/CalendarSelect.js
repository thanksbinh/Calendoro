import React, { useState, useContext } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CalendarContext from './CalendarContext';

export function CalendarSelect() {
    const { calendarList, calendarSelectMode, setCalendarSelectMode, selectedCalendarIdList, selectCalendarIdList } = useContext(CalendarContext);
    
    const [thisSelectedCalendarIdList, thisSelectCalendarIdList] = useState(selectedCalendarIdList);

    const onSubmit = () => {
        selectCalendarIdList(thisSelectedCalendarIdList);
        thisSelectCalendarIdList([]);
        setCalendarSelectMode(false);
    }

    const handleOnChange = (i) => {
        if (thisSelectedCalendarIdList.includes(calendarList[i].id)) {
            thisSelectCalendarIdList(thisSelectedCalendarIdList.filter(item => item !== calendarList[i].id))
        } else {
            thisSelectCalendarIdList([...thisSelectedCalendarIdList, calendarList[i].id]);
        }
    }

    return (
        <Popup open={calendarSelectMode} onClose={() => setCalendarSelectMode(false)}  modal>
            <legend className="legend-checkbox">Select calendar(s) to display </legend>
            <React.Fragment>
                {calendarList.map((calendar, i) => {
                    return (
                        <div className="form-check" key={calendar.id}>
                            <input className="form-check-input" type="checkbox" checked={thisSelectedCalendarIdList.includes(calendar.id)} id={"check"+i} onChange={() => handleOnChange(i)}/>
                            <label className="form-check-label" htmlFor={"check"+i}>
                                {calendar.summary}
                            </label>
                        </div>
                    )
                })}
            </React.Fragment>
            <button 
                className="btn btn-primary" 
                disabled={!calendarSelectMode}
                onClick={onSubmit}
            >
                Submit
            </button>
        </Popup> 
    )
} 