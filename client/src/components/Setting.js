import React, { useState, useContext, useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../style/setting.css';
import CalendarContext from '../javascript/CalendarContext';
import AppContext from "../javascript/AppContext";

export function Setting() {
    const { updateCalendar } = useContext(CalendarContext);
    const { setting, setSetting } = useContext(AppContext)

    const [settingMode, setSettingMode] = useState(false);
    const modal = true;
    const contentStyle = {};

    const [focusDur, setFocusDur] = useState(setting.focusDur / (60 * 1000));
    const [shortBreakDur, setShortBreakDur] = useState(setting.shortBreakDur / (60 * 1000));
    const [longBreakDur, setLongBreakDur] = useState(setting.longBreakDur / (60 * 1000));
    const [maxFocusCount, setMaxFocusCount] = useState(setting.maxFocusCount);

    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setSetting({
            focusDur: focusDur * 60 * 1000,
            shortBreakDur: shortBreakDur * 60 * 1000,
            longBreakDur: longBreakDur * 60 * 1000,
            maxFocusCount: maxFocusCount,
        });
        setSettingMode(false);
    }

    function handleSelectCalendar() {
        try {
            updateCalendar();
        } catch (error) {
            setWarningMessage('Access_token outdated, please log in again!');
            setShowWarning(true);
        }
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
                                <input className="form-input" type="number" min={0} max={60} id="value1" value={focusDur} onChange={(event) => setFocusDur(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="value2">Short Break</label>
                                <input className="form-input" type="number" min={0} max={60} id="value2" value={shortBreakDur} onChange={(event) => setShortBreakDur(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="value3">Long Break</label>
                                <input className="form-input" type="number" min={0} max={60} id="value3" value={longBreakDur} onChange={(event) => setLongBreakDur(event.target.value)} />
                            </div>
                        </div>
                        <div className="form-group justify-content-between align-items-center">
                            <label className="form-label" htmlFor="longBreakInterval">Long Break interval</label>
                            <input className="form-input" type="number" id="longBreakInterval" value={maxFocusCount} onChange={(event) => setMaxFocusCount(event.target.value)} />
                        </div>
                        <div className="form-group justify-content-between align-items-center">
                            <label className="form-label" htmlFor="longBreakInterval">Select calendar</label>
                            <button className="form-input d-flex justify-content-between" type="button" onClick={handleSelectCalendar}>Open <span className="material-symbols-outlined">open_in_new</span></button>
                        </div>
                        <div className="form-buttons">
                            <button className="form-button" type="submit">Submit</button>
                        </div>
                    </form>
                </div>

                <PopupWarning warning={showWarning} warningMessage={warningMessage} />
            </Popup>
        </div>
    )
}

function PopupWarning(props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (props.warning) {
            setShow(true);

            // Auto hide the popup after 3 seconds
            const timeoutId = setTimeout(() => {
                setShow(false);
            }, 3000);

            // Cleanup function to cancel the timeout if component unmounts before timeout completes
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [props.warning]);

    return (
        <div className={`popup-warning ${show ? 'show' : ''}`}>
            <span>{props.warningMessage}</span>
        </div>
    );
}