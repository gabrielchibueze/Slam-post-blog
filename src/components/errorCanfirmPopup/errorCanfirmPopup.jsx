/* eslint-disable react/prop-types */
import { Fragment, useRef } from "react";
import Modal from "../modal/modal";
import "./errorCanfirmPopup.css";
import MultiButtonComponent from "../button/multiButtonComponent";

export default function ErrorCanfirmPopup({ props }) {
    const errorCanConFirmRef = useRef()
    return (
        <Fragment>
            <Modal isError={props.isError} errorCanConFirmRef={errorCanConFirmRef}>
                <div className="errorCanfirmPopup" ref={errorCanConFirmRef}>
                    <h2>{props.title}</h2>
                    <p>{props.message}</p>
                    <div className="post-cancel-btns">
                        <MultiButtonComponent props={{
                            buttonProperties: [
                                { buttonType: props.buttonOneType, buttonTitle: props.buttonOneTitle, mode: "raised", design: "danger", buttonLink: null, buttonFunction: props.buttonOneFunction },
                                props.buttonTwoTitle ? { buttonType: props.buttonTwoType, buttonTitle: props.buttonTwoTitle, mode: "flat", design: "", buttonLink: null, buttonFunction: props.buttonTwoFunction } : {}
                            ]
                        }} />
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}
