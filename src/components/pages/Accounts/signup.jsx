import { Link } from "react-router-dom";
import ButtonComponent from "../../button/button";
import FormComponent from "../../forms.jsx/form";
import InputComponent from "../../input/input-component";
import "./signin-login-page.css"
import { useState } from "react";
import { isEmail, length, required } from "../../utils/validators";
import { useNavigate } from "react-router-dom/dist";

const USER_FORM = {
    fullname: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
    },
    email: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, isEmail]
    },
    username: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 3, max: 12 })]
    },
    password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 6, max: 12 })]
    }
}

export default function SignupPage() {
    const [state, setState] = useState({
        loading: false,
        userForm: USER_FORM,
        formIsValid: false
    })
    const navigate = useNavigate()

    const handleSubmitCreateAcount = (event) => {
        event.preventDefault();
        fetch("http://localhost:8080/auth/signup", {
            method: "put",
            body: JSON.stringify({
                fullname: state.userForm.fullname.value,
                email: state.userForm.email.value,
                username: state.userForm.username.value,
                password: state.userForm.password.value
            }),
            headers: {
                "Content-Type": "Application/json"
            }
        }).then(res => {
            if (!res.ok) {
                const error = new Error("Error occured creating user account");
                console.log(error);
                throw error;
            }

            return res.json()
        }).then(resData => {
            console.log(resData)
            setState(prevState => {
                return { ...prevState, loading: false }
            })

            navigate("/login")


        }).catch(err => {
            console.log(err)
        })
    }

    const inputBlurHandler = (input) => {
        setState(prevState => {
            const currentInputForm = {
                ...prevState.userForm, [input]: {
                    ...prevState.userForm[input], touched: true
                }
            }
            return {
                ...prevState, userForm: currentInputForm
            }
        })
    }
    const handleFormInputChange = (inputId, inputValue) => {
        setState(prevState => {
            let isValid = true
            for (let validator of prevState.userForm[inputId].validators) {
                isValid = isValid && validator(inputValue)
            }

            const updatedInputForm = {
                ...prevState.userForm, [inputId]: {
                    value: inputValue,
                    touched: true,
                    valid: isValid,
                    validators: prevState.userForm[inputId].validators
                }
            }
            let formIsValid = true
            for (let inputname in updatedInputForm) {
                formIsValid = formIsValid && updatedInputForm[inputname].valid
            }
            return {
                ...prevState, userForm: updatedInputForm, formIsValid: formIsValid
            }
        })
    }
console.log(state.formIsValid)
    console.log(state.userForm)

    return <div className="accounts-page">
        <div className="signup-page">
            <div className="signup-intro">
                <h2>Happy to join SLaM?</h2>
                <p>Quickly create an account to post your slam and get updates on recent slams</p>
            </div>
            <div className="signup-form-control">
                <FormComponent props={{ onSubmit: state.formIsValid ? handleSubmitCreateAcount : null }}>
                    <InputComponent props={{
                        id: "fullname",
                        type: "text",
                        name: "fullname",
                        label: "Full name",
                        control: "input",
                        placeholder: "Enter your full name",
                        onChange: handleFormInputChange,
                        onBlur: () => inputBlurHandler("fullname"),
                        touched: state.userForm["fullname"].touched,
                        valid: state.userForm["fullname"].value,
                        value: state.userForm["fullname"].value,
                    }} />
                    <InputComponent props={{
                        id: "email",
                        type: "email",
                        name: "email",
                        label: "Email",
                        control: "input",
                        placeholder: "Enter your email",
                        onChange: handleFormInputChange,
                        onBlur: () => inputBlurHandler("email"),
                        touched: state.userForm["email"].touched,
                        valid: state.userForm["email"].value,
                        value: state.userForm["email"].value,
                    }} />
                    <InputComponent props={{
                        id: "username",
                        type: "text",
                        name: "username",
                        label: "Username",
                        control: "input",
                        placeholder: "Choose username",
                        onChange: handleFormInputChange,
                        onBlur: () => inputBlurHandler("username"),
                        touched: state.userForm["username"].touched,
                        valid: state.userForm["username"].value,
                        value: state.userForm["username"].value,
                    }} />
                    <InputComponent props={{
                        id: "password",
                        type: "password",
                        name: "password",
                        label: "Password",
                        control: "input",
                        placeholder: "Password",
                        onChange: handleFormInputChange,
                        onBlur: () => inputBlurHandler("password"),
                        touched: state.userForm["password"].touched,
                        valid: state.userForm["password"].value,
                        value: state.userForm["password"].value,

                    }} />

                    <ButtonComponent props={{ type: "submit", title: "Create account", onClick: state.formIsValid ? handleSubmitCreateAcount  : null}} />

                </FormComponent>
            </div>
        </div>
        <div className="signup-link">
            <h3>Already have an account?</h3>
            <Link to="/login">Login</Link>
        </div>
    </div>
}