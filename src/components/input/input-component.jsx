/* eslint-disable react/prop-types */
import "./input-component.css"
export default function InputComponent({ props }) {
    return <div className="input">
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {
            props.control === "input" &&
            <input
                className={
                    [
                        props.valid ? "valid" : "invalid", props.touched ? "touched" : "untouched"
                    ].join(" ")
                }
                id={props.id}
                type={props.type}
                required={props.required}
                value={props.value}
                onChange={e => props.onChange(props.id, e.target.value)}
                onBlur={props.onBlur}
                placeholder={props.placeholder}
            />
        }
        {
            props.control === "textarea" &&
            <textarea
                className={
                    [
                        props.valid ? "valid" : "invalid", props.touched ? "touched" : "untouched"
                    ].join(" ")
                }
                id={props.id}
                rows={props.rows}
                required={props.required}
                value={props.value}
                onChange={e => props.onChange(props.id, e.target.value)}
                onBlur={props.onBlur}
            />
        }
        {!props.valid && props.touched && <p className="input__error-message">This field cannot be empty</p>}
    </div>
}