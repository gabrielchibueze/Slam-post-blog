/* eslint-disable react/prop-types */
import "./modal.css"
export default function Modal({ children }) {
    return (
        <div className="modal-popup">
            {children}
        </div>
    )
}