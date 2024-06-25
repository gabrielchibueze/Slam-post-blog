/* eslint-disable react/prop-types */
import "./input-component.css";

export default function FilePicker({ props }) {
    return <div className="input">
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {
            <input
                className={
                    [
                        "file-picker", props.valid ? "valid" : "invalid", props.touched ? "touched" : "untouched"
                    ].join(" ")
                }
                id={props.id}
                type={`${props.type}`}
                required={props.required}
                value={props.value}
                onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
                onBlur={props.onBlur}
            // placeholder={props.placeholder}
            />
        }
    </div>
}