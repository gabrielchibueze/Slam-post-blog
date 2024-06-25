/* eslint-disable react/prop-types */
import { useContext} from "react";
import "./modal.css";
import { FeedContext } from "../feedContextProvider/feedContextProvider";
import HandleErrorsHook from "./handleErrorHook";

export default function Modal({ children, errorCanConFirmRef }) {
    const { errorHandler } = useContext(FeedContext);
    // Use custom hook
    HandleErrorsHook(errorCanConFirmRef, errorHandler);

    return (
        <div className="modal-popup" ref={errorCanConFirmRef}>
            {children}
        </div>
    );
}
