/* eslint-disable react/prop-types */
// import {React} from "react";

import { Link } from "react-router-dom";
import "./button.css";

export default function ButtonComponent({ props }) {
    return <div>
        {
            !props.link ?
                (<button
                    onClick={props.onClick}
                    type={props.type}
                    disabled={props.loading || props.disabled}
                    className={
                        ['button', `button--${props.design}`, `buttton--${props.mode}`].join(" ")
                    }>
                    {props.loading ? "Loading..." : props.title}
                </button>)
                :
                (<Link
                    to={props.link}
                    className={
                        ['link-btn', 'button', `button--${props.design}`, `buttton--${props.mode}`].join(" ")
                    } style={{paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
                    {props.title}
                </Link>)
        }


    </div>

    // <div>
    //     <button onClick={props.onClick} type={props.type} className="all-buttons">{props.title}</button>
    // </div>
}
