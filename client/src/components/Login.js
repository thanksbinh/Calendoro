import React, { useState, useEffect, useContext } from 'react';
import { CalendarSelect } from './CalendarSelect';
import { setCookie } from '../javascript/cookie';
import CalendarContext from '../javascript/CalendarContext';
import AppContext from '../javascript/AppContext';
import { firebase, auth } from "../firebase/firebase-app";
import 'firebase/compat/firestore';
import { collection, addDoc } from "firebase/firestore";

export function Login() {
    const { setCalendarList, selectedCalendarIdList, selectCalendarIdList, updateCalendar, state } = useContext(CalendarContext);
    const { calendarRef } = useContext(AppContext)

    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user._delegate);
            }
        })
    }, [])

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        provider.addScope("https://www.googleapis.com/auth/calendar");

        try {
            const codeResponse = await auth.signInWithPopup(provider);

            auth.onAuthStateChanged(user => {
                if (user) {
                    setUser(user._delegate);
                    updateCalendar(codeResponse.credential.accessToken);
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    const logOut = () => {
        auth.signOut();
        setUser(null);

        setCalendarList([]);
        selectCalendarIdList([]);
        setCookie("selectedCalendarId", "");
    };

    // Recheck this function
    const syncServer = (items) => {
        let historyStr = JSON.parse(localStorage.getItem("history"));
        let history = historyStr.map(objectStr => JSON.parse(objectStr));
        let historyHasId = history.filter(object => object.uid === user.uid);

        // Add to local
        let starts = new Set(historyHasId.map(item => item.start));

        let newLocalData = items.filter(item => !starts.has(item.start.toISOString()));
        let newDataStr = newLocalData.map(item => JSON.stringify(item));

        localStorage.setItem("history", JSON.stringify([...newDataStr, ...historyStr]));

        // Add to server
        starts = new Set(items.map(item => item.start.toISOString()));

        let newServerData = historyHasId.filter(item => !starts.has(item.start));

        const db = firebase.firestore();
        newServerData.forEach(async (data) => {
            const newData = {
                start: firebase.firestore.Timestamp.fromDate(new Date(data.start)),
                end: firebase.firestore.Timestamp.fromDate(new Date(data.end)),
                title: data.title,
                uid: data.uid
            };

            const docRef = await addDoc(collection(db, "history"), newData);

            if (docRef.id) {
                console.log("Data added successfully!");
            } else {
                console.log("Error adding data!");
            }
        })
    }

    useEffect(() => {
        function updateCalendarSource() {
            if (!calendarRef.current) return;

            const eventSources = calendarRef.current.getApi().getEventSources();
            eventSources.forEach(source => {
                source.remove();
            })

            if (!user) return;

            const db = firebase.firestore();
            let historyRef;
            let unsubscribe;

            // Download history from server
            auth.onAuthStateChanged(user => {
                if (user) {
                    historyRef = db.collection('history');
                    unsubscribe = historyRef
                        .where('uid', '==', user.uid)
                        .onSnapshot(querySnapshot => {
                            const items = querySnapshot.docs.map(doc => {
                                return {
                                    start: doc.data().start.toDate(),
                                    end: doc.data().end.toDate(),
                                    title: doc.data().title,
                                    uid: doc.data().uid
                                }
                            });

                            syncServer(items);
                        }
                        )
                } else {
                    unsubscribe && unsubscribe();
                }
            })

            // Local source
            calendarRef.current.getApi().addEventSource({
                events: async function () {
                    let historyStr = JSON.parse(localStorage.getItem("history"));
                    let history = historyStr.map(objectStr => JSON.parse(objectStr));
                    history = history.filter(object => object.uid === "" || object.uid === user.uid);

                    return history;
                },
                color: 'rgba(240,178,188,1)',
                id: user.uid
            });

            // Google calendar source
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
    }, [user, selectedCalendarIdList]) // eslint-disable-line react-hooks/exhaustive-deps

    // Add uid to events
    useEffect(() => {
        if (!user) return;

        let historyStr = JSON.parse(localStorage.getItem("history"));
        let history = historyStr.map(objectStr => JSON.parse(objectStr));
        history.forEach((item, index) => {
            if (item.uid === "") {
                history[index].uid = user.uid;
            }
        })

        historyStr = history.map(item => JSON.stringify(item));
        localStorage.setItem("history", JSON.stringify(historyStr));
    }, [state, user])

    return (
        <div>
            {user ? (
                <div className='p-2'>
                    <img src={user.photoURL} alt="user profile" onClick={logOut} className="profile-picture rounded" />
                </div>
            ) : (
                <span className="material-symbols-outlined p-2 login-btn" onClick={login}>login</span>
            )}
            <CalendarSelect />
        </div>
    );
}
