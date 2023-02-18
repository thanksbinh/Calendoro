import React, { useState, useEffect, useContext } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { CalendarSelect } from './CalendarSelect';
import { setCookie, getCookie } from '../javascript/cookie';
import CalendarContext from '../javascript/CalendarContext';
import AppContext from '../javascript/AppContext';

export function Login(props) {
    const { selectedCalendarIdList, selectCalendarIdList, updateCalendar } = useContext(CalendarContext);
    const { calendarRef } = useContext(AppContext)

    const [user, setUser] = useState(getCookie("user") ? JSON.parse(getCookie("user")) : null);
    const [profile, setProfile] = useState(getCookie("profile") ? JSON.parse(getCookie("profile")) : null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
        scope: "https://www.googleapis.com/auth/calendar"
    });

    const logOut = () => {
        // removeEventSources();

        googleLogout();
        setProfile(null);
        selectCalendarIdList([]);

        setCookie("profile", "");
        setCookie("user", "");
        setCookie("selectedCalendarId", "");
    };

    // When new login section, no user in cookie, update profile, select user's calendar, 
    // add user to database if not existed
    useEffect(() => {
        if (user && !getCookie("user")) {
            setCookie("user", JSON.stringify(user));

            async function newUser(thisProfile) {
                let object = {
                    "userId": thisProfile.id,
                    "email": thisProfile.email,
                    "name": thisProfile.name,
                };
                await axios.post("http://localhost:3001/login", object);
                console.log("sent", object);
            }

            async function updateProfile() {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                setProfile(res.data);
                setCookie("profile", JSON.stringify(res.data));

                const userExist = await axios.get("http://localhost:3001/login", {
                    params: {
                        userId: res.data.id
                    }
                });
                if (!userExist.data) await newUser(res.data);
                else {
                    console.log("user exist");
                }
            }

            updateProfile();
            updateCalendar();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        function updateCalendarSource() {
            if (!calendarRef.current) return;

            const eventSources = calendarRef.current.getApi().getEventSources();
            eventSources.forEach(source => {
                source.remove();
            })

            if (!profile) {
                return;
            }

            calendarRef.current.getApi().addEventSource({
                events: async function () {
                    const res = await axios.get("http://localhost:3001/post", {
                        params: { userId: profile.id }
                    });
                    return res.data;
                },
                color: 'rgba(240,178,188,1)',
                id: profile.id
            });

            selectedCalendarIdList.forEach(id => {
                calendarRef.current.getApi().addEventSource({
                    googleCalendarId: id,
                    color: 'rgba(32,120,254,0.5)',
                    id: id
                });
            })

            setCookie("selectedCalendarId", selectedCalendarIdList, 30);
        }

        updateCalendarSource();
    }, [profile, selectedCalendarIdList]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {profile ? (
                <div className='p-2'>
                    <img src={profile.picture} alt="user profile" onClick={logOut} className="profile-picture rounded" />
                </div>
            ) : (
                <span className="material-symbols-outlined p-2 login-btn" onClick={() => login()}>login</span>
            )}
            <CalendarSelect/>
        </div>
    );
}