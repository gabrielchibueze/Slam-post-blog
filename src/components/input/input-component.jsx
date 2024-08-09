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
                placeholder={props.placeholder ? props.placeholder : ""}
                onChange={e => props.onChange(props.id, e.target.value)}
                onBlur={props.onBlur}
            />
        }
        {props.value?.trim() === "" && props.touched && <p className="input__error-message">This field cannot be empty</p>}
        {props.value?.length > 1 && props.touched && <div>
            {!props.valid && props.touched && props.id === "title" && <p className="input__error-message">Title must be above 4 characters</p>}
        </div>
        }

        {props.value?.length > 0 && props.touched &&
            <div>
                {!props.valid && props.touched && props.id === "fullname" && <p className="input__error-message">A minimum of 3 characters is required here.</p>}
                {!props.valid && props.touched && props.id === "password" && <p className="input__error-message">Password not be less than 6 characters</p>}
                {!props.valid && props.touched && props.id === "username" && <p className="input__error-message">Username must be above 2 characters.</p>}
                {!props.valid && props.touched && props.id === "email" && <p className="input__error-message">This must be a valid email</p>}
                {!props.valid && props.touched && props.id === "emailaddress" && <p className="input__error-message">This must be a valid email</p>}
                {!props.valid && props.touched && props.id === "name" && <p className="input__error-message">Name must be above 3 characters</p>}
                {!props.valid && props.touched && props.id === "enquiry" && <p className="input__error-message">Enquiry must be above 5 characters</p>}
                {!props.valid && props.touched && props.id === "content" && <p className="input__error-message">Content must be above 6 characters</p>}
            </div>
        }
    </div>
}