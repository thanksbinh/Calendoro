import React, { useState, useContext } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './setting.css';
import CalendarContext from './CalendarContext';

export function Setting(props) {
    const { updateCalendar } = useContext(CalendarContext);

    const [settingMode, setSettingMode] = useState(false);
    const modal = true;
    const contentStyle = {};

    const [focusDur, setFocusDur] = useState(25);
    const [shortBreakDur, setShortBreakDur] = useState(5);
    const [longBreakDur, setLongBreakDur] = useState(15);
    const [maxFocusCount, setMaxFocusCount] = useState(4);

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setSetting({
            focusDur: focusDur * 60 * 1000,
            shortBreakDur: shortBreakDur * 60 * 1000,
            longBreakDur: longBreakDur * 60 * 1000,
            maxFocusCount: maxFocusCount,
        });
        setSettingMode(false);
    }

    return (
        <div>
            <span className={"material-symbols-outlined setting-btn p-2" + (settingMode ? " btn-select" : "")} onClick={() => setSettingMode(!settingMode)}>settings</span>
            <Popup open={settingMode} onClose={() => setSettingMode(false)} {...{ modal, contentStyle }}>
                <div className="form-container">
                    <h2 className="form-title">Settings</h2>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="first-line d-flex justify-content-between">
                            <div className="form-group">
                                <label className="form-label" htmlFor="value1">Focus</label>
                                <input className="form-input" type="number" id="value1" value={focusDur} onChange={(event) => setFocusDur(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="value2">Short Break</label>
                                <input className="form-input" type="number" id="value2" value={shortBreakDur} onChange={(event) => setShortBreakDur(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="value3">Long Break</label>
                                <input className="form-input" type="number" id="value3" value={longBreakDur} onChange={(event) => setLongBreakDur(event.target.value)} />
                            </div>
                        </div>
                        <div className="form-group justify-content-between align-items-center">
                            <label className="form-label" htmlFor="longBreakInterval">Long Break interval</label>
                            <input className="form-input" type="number" id="longBreakInterval" value={maxFocusCount} onChange={(event) => setMaxFocusCount(event.target.value)} />
                        </div>
                        <div className="form-group justify-content-between align-items-center">
                            <label className="form-label" htmlFor="longBreakInterval">Select calendar</label>
                            <button className="form-input d-flex justify-content-between" type="button" onClick={updateCalendar}>Open <span className="material-symbols-outlined">open_in_new</span></button>
                        </div>
                        <div className="form-buttons">
                            <button className="form-button" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </Popup>
        </div>
    )
}