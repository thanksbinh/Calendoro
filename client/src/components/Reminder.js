import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import '../style/reminder.css';

export function Reminder() {
    // ["Look outside", "Stand up", "Exercise"]
    if (!localStorage.getItem("reminderList")) {
        localStorage.setItem("reminderList", JSON.stringify([]))
    }

    const [reminders, setReminders] = useState(JSON.parse(localStorage.getItem("reminderList")));
    const [currentReminder, setCurrentReminder] = useState("");
    const [inputVisibility, setInputVisibility] = useState(false);
    const reminderRef = useRef(null);
    const listRef = useRef(null);

    // Hide input box and show button to reveal
    useEffect(() => {
        if (!localStorage.getItem("reminderList")) {
            localStorage.setItem("reminderList", JSON.stringify([]))
        }
        
        const inputBox = reminderRef.current.children[1];
        inputBox.style.display = 'none';

        setTimeout(() => {
            reminderRef.current.style.opacity = "1";
        }, 350)
    }, [])
    useEffect(() => {
        const addInputBtn = reminderRef.current.querySelector('.show-input-btn');
        addInputBtn.style.display = inputVisibility ? 'none' : 'block';
    }, [inputVisibility])

    // Height of Reminder component
    useLayoutEffect(() => {
        setTimeout(() => {
            const listHeight = (inputVisibility ? 163 : 99) + listRef.current.offsetHeight;
            reminderRef.current.style.height = `${listHeight}px`;
        }, 100)
    }, [reminders, inputVisibility]);

    const effectAddReminder = () => {
        if (reminders.length === 0) return;

        const list = listRef.current;
        const firstItem = list.firstChild;
        const offset = firstItem.offsetHeight;
        const transition = 'transform 0.3s ease-in-out';

        list.style.transition = 'none';
        list.style.transform = `translateY(-${offset}px)`;

        setTimeout(() => {
            list.style.transition = transition;
            list.style.transform = `translateY(0)`;
        }, 0);
    }

    const addReminder = () => {
        setReminders([currentReminder, ...reminders]);

        const listRepeat = JSON.parse(localStorage.getItem("reminderList")); 
        localStorage.setItem("reminderList", JSON.stringify([currentReminder, ...listRepeat]));

        setCurrentReminder("");
    };

    const removeReminder = (removedIndex) => {
        const list = listRef.current;
        const item = list.children[removedIndex];
        const itemHeight = item.offsetHeight;
        const itemsAfterRemoved = Array.from(list.children).slice(removedIndex + 1);
        const transition = `transform 0.3s ease-in-out`;

        item.style.opacity = '0';

        itemsAfterRemoved.forEach((currentItem) => {
            currentItem.style.transition = transition;
            currentItem.style.transform = `translateY(-${itemHeight}px)`;
        });

        reminderRef.current.style.height = `${reminderRef.current.offsetHeight - itemHeight - 10}px`;

        setTimeout(() => {
            setReminders((prevItems) => prevItems.filter((_, index) => index !== removedIndex));

            itemsAfterRemoved.forEach((currentItem) => {
                currentItem.style.transition = "";
                currentItem.style.transform = "";
            });
        }, 250);
    };

    const markRepeat = (index) => {
        const item = listRef.current.children[index];
        const repeatBtn = item.querySelector(".repeat-btn");

        if (repeatBtn.style.color !== 'white') {
            repeatBtn.style.color = 'white';
        } else {
            repeatBtn.style.color = 'rgba(240, 178, 188, 1)';
        }

        const listRepeat = JSON.parse(localStorage.getItem("reminderList")); 
        const thisTask = reminders[index];

        if (listRepeat.includes(thisTask)) {
            localStorage.setItem("reminderList", JSON.stringify(listRepeat.filter(item => item !== thisTask)));
        } else {
            localStorage.setItem("reminderList", JSON.stringify([reminders[index], ...listRepeat]));
        }
    }

    const handleInputChange = (event) => {
        setCurrentReminder(event.target.value);
    };

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        if (currentReminder) {
            addReminder();
            effectAddReminder();
        }
    };

    const showInputBox = () => {
        setInputVisibility(true);

        const list = listRef.current;
        const inputBox = reminderRef.current.children[1];
        const transition = 'transform 0.3s ease-in-out';

        list.style.transition = transition;
        list.style.transform = `translateY(64px)`;

        setTimeout(() => {
            inputBox.style.display = 'flex';
            list.style.transition = `none`;
            list.style.transform = `translateY(0px)`;
        }, 300)
    }

    const hideInputBox = () => {
        if (currentReminder) return;

        const list = listRef.current;
        const inputBox = reminderRef.current.children[1];
        const transition = 'transform 0.3s ease-in-out';

        inputBox.style.display = 'none';
        list.style.transition = 'none';
        list.style.transform = `translateY(64px)`;

        setTimeout(() => {
            list.style.transition = transition;
            list.style.transform = `translateY(0px)`;

            setInputVisibility(false);
        }, 300)
    }

    return (
        <div className="reminder-list" ref={reminderRef}>
            <h2>Side-quests
                <span className="show-input-btn material-symbols-outlined" onClick={showInputBox}>add_circle</span>
            </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={currentReminder}
                    onChange={handleInputChange}
                    placeholder="Add a new item..."
                    onBlur={hideInputBox}
                />
                <button type="submit" className="main-btn btn btn-light">
                    <span className="material-symbols-outlined">add_circle</span>
                </button>
            </form>
            <ul ref={listRef}>
                {reminders.map((reminder, index) => (
                    <li key={reminder} className="reminder-item">
                        {reminder}
                        <div>
                            <button onClick={() => markRepeat(index)}>
                                <span className={"material-symbols-outlined repeat-btn" + (JSON.parse(localStorage.getItem("reminderList")) ? " is-repeat" : "")}>repeat</span>
                            </button>
                            <button onClick={() => removeReminder(index)}>
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}