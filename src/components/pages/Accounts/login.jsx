/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ButtonComponent from "../../button/button";
import FormComponent from "../../forms.jsx/form";
import InputComponent from "../../input/input-component";
import "./signin-login-page.css"
import { useState } from "react";
import { isEmail, length, required } from "../../utils/validators";
import { useNavigate } from "react-router-dom/dist";
const USER_FORM = {
    email: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, isEmail]
    },
    password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 6, max: 12 })]
    }
}


export default function LoginPage({ props }) {
    const [state, setState] = useState({
        loading: false,
        userForm: USER_FORM,
        formIsValid: false
    })
    const navigate = useNavigate()

    const handleSubmitCreateAcount = (event) => {
        event.preventDefault();
        fetch("http://localhost:8080/auth/login", {
            method: "put",
            body: JSON.stringify({
                email: state.userForm.email.value,
                password: state.userForm.password.value
            }),
            headers: {
                "Content-Type": "Application/json"
            }
        }).then(res => {
            if (res.status !== 200 && res.status !==201) {
                const error = new Error("Error occured during account login... check if login details are correct");
                console.log(error);
                navigate("/login")
                throw error;
            }
            else {
                return res.json()
            }
        }).then(resData => {
            // console.log(resData)
            props.comfirmSubmitLogin(resData)
            setState(prevState => {
                return { ...prevState, loading: false }
            })

            navigate("/")


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

    return <div className="accounts-page">
        <div className="signup-page">
            <div className="signup-intro">
                <h2>Welcome back to SLaM!!</h2>
                <p>Login into your account to access your slam posts and get recent updates in the SLaM community</p>
            </div>
            <div className="signup-form-control">
                <FormComponent props={{ onsubmit: state.formIsValid ? handleSubmitCreateAcount : null }}>
                    <InputComponent props={{
                        id: "email",
                        type: "email",
                        name: "email",
                        label: "Email",
                        control: "input",
                        placeholder: "Enter your email",
                        onBlur: () => inputBlurHandler("email"),
                        onChange: handleFormInputChange,
                        value: state.userForm["email"].value,
                        valid: state.userForm["email"].valid,
                        touched: state.userForm["email"].touched

                    }} />
                    <InputComponent props={{
                        id: "password",
                        type: "password",
                        name: "password",
                        label: "Password",
                        control: "input",
                        placeholder: "Enter password",
                        onBlur: () => inputBlurHandler("password"),
                        onChange: handleFormInputChange,
                        value: state.userForm["password"].value,
                        valid: state.userForm["password"].valid,
                        touched: state.userForm["password"].touched

                    }} />
                    <ButtonComponent props={{ type: "submit", title: "Login", onClick: state.formIsValid ? handleSubmitCreateAcount : null }} />
                    <Link to="/password-reset">Forgotten Your password?</Link>
                </FormComponent>

            </div>
        </div>
        <div className="signup-link">
            <h3>New to SLaM?</h3>
            <Link to="/signup">Sign up</Link>
        </div>

    </div>
}