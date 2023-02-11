import React, { useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export function Setting(props) {
    const [settingMode, setSettingMode] = useState(false);
    const [setting, setSetting] = useState({
        focusDur: 25 * 60 * 1000,
        shortBreakDur: 5 * 60 * 1000,
        longBreakDur: 15 * 60 * 1000,
        maxFocusCount: 4,
    });
    const closeModal = () => setSettingMode(false);
    const modal = true;
    const contentStyle = {};

    function handleSetFocusDur(event) {
        setSetting({
            ...setting,
            focusDur: event.target.value * 60 * 1000
        })
    }

    function handleSetShortBreakDur(event) {
        setSetting({
            ...setting,
            shortBreakDur: event.target.value * 60 * 1000
        })
    }

    function handleSetLongBreakDur(event) {
        setSetting({
            ...setting,
            longBreakDur: event.target.value * 60 * 1000
        })
    }

    function handleSetMaxFocusCountSet(event) {
        setSetting({
            ...setting,
            maxFocusCountSet: event.target.value
        })
    }

    return (
        <div>
            <span className={"material-symbols-outlined setting-btn p-2" + (settingMode ? " btn-select" : "")} onClick={() => setSettingMode(!settingMode)}>settings</span>
            <Popup open={settingMode} onClose={closeModal}  {...{ modal, contentStyle }}>
                <legend className="legend-setting"> Setting </legend>
                <form>
                    <div className="form-row d-flex">
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Focus Duration (min)" id="focusDurSet" onChange={handleSetFocusDur} />
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Short Break Duration (min)" id="shortBreakDurSet" onChange={handleSetShortBreakDur} />
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Long Break Duration (min)" id="longBreakDurSet" onChange={handleSetLongBreakDur} />
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Long Break interval" id="maxFocusCountSet" onChange={handleSetMaxFocusCountSet} />
                        </div>
                    </div>
                </form>
                <button className="btn btn-primary" onClick={() => { props.setSetting(setting); closeModal() }}>Submit</button>
            </Popup>
        </div>
    )
}