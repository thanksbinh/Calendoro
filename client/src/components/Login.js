import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { CalendarSelect } from './CalendarSelect';
import { setCookie, getCookie } from './Cookie';

export function Login(props) {
    const [user, setUser] = useState(getCookie("user") ? JSON.parse(getCookie("user")) : null);
    const [profile, setProfile] = useState(getCookie("profile") ? JSON.parse(getCookie("profile")) : null);
    const [calendarList, setCalendarList] = useState([]);
    const [calendarSelectMode, setCalendarSelectMode] = useState(false);
    const [selectedCalendarIdList, selectCalendarIdList] = useState(getCookie("selectedCalendarId") ? getCookie("selectedCalendarId").split(",") : []);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
        scope: "https://www.googleapis.com/auth/calendar"
    });

    const logOut = () => {
        removeEventSources();

        googleLogout();
        setProfile(null);
        selectCalendarIdList([]);

        setCookie("profile", "");
        setCookie("user", "");
        setCookie("selectedCalendarId", "");
    };

    // Remove every event source in calendarRef
    const removeEventSources = () => {
        let eventSource = props.calendarRef.current.getApi().getEventSources();
        eventSource.forEach(source => {
            source.remove();
        })
    }

    // When selectedCalendarIdList change, add event sources if not already added
    useEffect(() => {
        const addEventSources = () => {
            if (!props.calendarRef.current) {
                console.log('too fast');
                return;
            }
            let eventSource = props.calendarRef.current.getApi().getEventSources();
            eventSource = eventSource.map(source => source.internalEventSource.meta.googleCalendarId);

            selectedCalendarIdList.forEach(id => {
                if (id && !eventSource.includes(id)) props.calendarRef.current.getApi().addEventSource({
                    googleCalendarId: id,
                    color: 'rgba(153,187,225,1)',
                    id: id
                });
            })
            setCookie("selectedCalendarId", selectedCalendarIdList, 30);
        }

        addEventSources();
    }, [props.calendarRef, selectedCalendarIdList])

    // When new login section, no user in cookie, update profile, select user's calendar
    useEffect(() => {
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
    }, [user]);

    // Update user history event if profile != null 
    useEffect(() => {
        async function addUserHistory() {
            if (profile) props.calendarRef.current.getApi().addEventSource({
                events: async function() {
                    try {
                        const res = await axios.get("http://localhost:3001/post", { 
                            params: {
                                userId: profile.id 
                            }
                        });
                        return res.data;
                    } catch (error) {
                        console.log("addUserHistory error", error);
                    }
                }, 
                color: 'rgb(225, 155, 153)',
                id: profile.id
            });
        }

        addUserHistory();
    }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get event from google calendar manually
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

    return (
        <div>
            {profile ? (
                <div className='p-2'>
                    <img src={profile.picture} alt="user profile" onClick={logOut} className="profile-picture rounded" />
                </div>
            ) : (
                <span className="material-symbols-outlined p-2 login-btn" onClick={() => login()}>login</span>
            )}
            <CalendarSelect calendarList={calendarList} open={calendarSelectMode} setOpen={setCalendarSelectMode} calendarRef={props.calendarRef} selectCalendarIdList={selectCalendarIdList} />
        </div>
    );
}