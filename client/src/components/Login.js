import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { CalendarSelect } from './CalendarSelect';
import { setCookie, getCookie } from './Cookie';

export function Login(props) {
    const [ user, setUser ] = useState(getCookie("user") ? JSON.parse(getCookie("user")) : null);
    const [ profile, setProfile ] = useState(getCookie("profile") ? JSON.parse(getCookie("profile")) : null);
    const [ calendarList, setCalendarList] = useState([]);
    const [ calendarSelectMode, setCalendarSelectMode] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
        scope: "https://www.googleapis.com/auth/calendar"
    });

    useEffect(() => {
        // New login section, no user in cookie
        if (user && !getCookie("user")) {
            setCookie("user", JSON.stringify(user));

            async function updateProfile() {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                setProfile(res.data);
                setCookie("profile", JSON.stringify(res.data));
            }
            
            async function updateCalendar() {
                const res = await axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                });
                res.data.items.sort((a, b) => a.summary.localeCompare(b.summary));
                setCalendarList(res.data.items);
                setCalendarSelectMode(true);
            }

            updateProfile();
            updateCalendar();
        }
    }, [ user ]);

    // useEffect(() => {
        // async function updateEvents() {
        //     let eventList = [];

        //     for (let selectedCalendar of selectedCalendarList) {
        //         let start = new Date("2023-02-06").toISOString();
        //         let end = new Date("2023-02-12").toISOString();
        //         const res = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar.id}/events?timeMin=${start}&timeMax=${end}`, {
        //             headers: {
        //                 Authorization: `Bearer ${user.access_token}`,
        //                 Accept: 'application/json',
        //             }
        //         })
        //         console.log(res.data.items);
        //         eventList.push(res.data);
        //     }

        //     props.setEventList(eventList);
        //     console.log("Select calendar success", eventList);
        // }
        
        // if (user) updateEvents();
    // }, [selectedCalendarList])

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        setCookie("profile", "");
        setCookie("user", "");
        setCookie("selectedCalendarId", "");
        // Todo: wipe data fullcalendar and goal
    };

    return (
        <div>
            {profile ? (
                <div className='p-2'>
                    <img src={profile.picture} alt="user profile" onClick={logOut} className="profile-picture"/>
                </div>
            ) : (
                <span className="material-symbols-outlined p-2 login-btn" onClick={() => login()}>login</span>
            )}
            <CalendarSelect calendarList={calendarList} open={calendarSelectMode} setOpen={setCalendarSelectMode} calendarRef={props.calendarRef}/>
        </div>
    );
}