import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { CalendarSelect } from './CalendarSelect';

export function Login() {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState([]);
    const [ calendarList, setCalendarList] = useState([]);
    const [ isCalendarSelect, setIsCalendarSelect] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
        scope: "https://www.googleapis.com/auth/calendar"
    });

    useEffect(
        () => {
            if (user != null) {
                console.log("user", user)

                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                }).then((res) => {
                    setProfile(res.data);
                    console.log(res.data);
                }).catch((err) => console.log(err));

                axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
                    headers: {
                        'Authorization': `Bearer ${user.access_token}`
                    }
                }).then((res) => {
                    res.data.items.sort((a, b) => a.summary.localeCompare(b.summary));
                    setCalendarList(res.data.items);
                    setIsCalendarSelect(true);
                })
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
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
            <CalendarSelect calendarList={calendarList} open={isCalendarSelect} setOpen={setIsCalendarSelect}/>
        </div>
    );
}