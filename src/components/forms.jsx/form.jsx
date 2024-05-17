/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./form.css"
export default function FormComponent({ props, children }) {

    return <form className="form-component" onSubmit={props.onSubmit}>
            {children}
        </form>

}