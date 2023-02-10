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

    function handleSetFocusDur() {
        setSetting({
            ...setting,
            focusDur: parseInt(document.getElementById("focusDurSet").value) * 60 * 1000
        })
    }

    function handleSetShortBreakDur() {
        setSetting({
            ...setting,
            shortBreakDur: parseInt(document.getElementById("shortBreakDurSet").value) * 60 * 1000
        })
    }

    function handleSetLongBreakDur() {
        setSetting({
            ...setting,
            longBreakDur: parseInt(document.getElementById("longBreakDur").value) * 60 * 1000
        })
    }

    function handleSetMaxFocusCountSet() {
        setSetting({
            ...setting,
            maxFocusCountSet: parseInt(document.getElementById("maxFocusCountSet").value)
        })
    }

    return (
        <div>
            <span className="material-symbols-outlined setting-btn p-2" onClick={() => setSettingMode(!settingMode)}>settings</span>
            <Popup open={settingMode} onClose={closeModal} modal>
                <legend className="legend-setting"> Setting </legend>
                <form>
                    <div className="form-row">
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Focus Duration (min)"  id="focusDurSet" onChange={handleSetFocusDur}/>
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Short Break Duration (min)" id="shortBreakDurSet" onChange={handleSetShortBreakDur}/>
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Long Break Duration (min)" id="longBreakDurSet" onChange={handleSetLongBreakDur}/>
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="Max Sequential Focus Number" id="maxFocusCountSet" onChange={handleSetMaxFocusCountSet}/>
                        </div>
                    </div>
                </form>
                <button className="btn btn-primary" onClick={() => { props.setSetting(setting); closeModal() }}>Submit</button>
            </Popup>
        </div>
    )
}