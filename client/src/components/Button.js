import React from "react";

export const Button = (props) => {
    const classList = "main-btn btn btn-light btn-lg px-5" + (props.addClass ? " " + props.addClass : "");
    return (
        <button className={classList} onClick={props.click}> {props.value} </button>
    )
}