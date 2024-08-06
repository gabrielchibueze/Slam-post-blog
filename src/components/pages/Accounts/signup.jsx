import { Link } from "react-router-dom";
import ButtonComponent from "../../button/button";
import FormComponent from "../../forms.jsx/form";
import InputComponent from "../../input/input-component";
import "./signin-login-page.css"
import { useContext, useEffect, useState } from "react";
import { isEmail, length, required } from "../../utils/validators";
import { useNavigate } from "react-router-dom/dist";
import { FeedContext } from "../../feedContextProvider/feedContextProvider";

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

    const {
        state,
        setState,
        catchError
    } = useContext(FeedContext)

    const [currentState, setCurrentState] = useState({
        loading: false,
        userForm: USER_FORM,
        formIsValid: false
    })
    useEffect(() => {
        window.scrollTo({
            top: 0
        })
    }, [])
    
    // useEffect(() => {
    //     fetch('https://slampost-8dd6d1d06367.herokuapp.com/slam/csrf-token')
    //         .then(response => response.json())
    //         .then(data => {
    //             setState(prevState => {
    //                 return {
    //                     ...prevState, csrfToken: data.csrfToken
    //                 }
    //             })
    //         }
    //         ).catch(catchError);
    // }, []);

    const navigate = useNavigate()

    const handleSubmitCreateAcount = (event) => {
        event.preventDefault();
        setState(prevState => {
            return { ...prevState, loading: true }
        })
        fetch("https://slampost-8dd6d1d06367.herokuapp.com/auth/signup", {
            method: "put",
            body: JSON.stringify({
                fullname: currentState.userForm.fullname.value,
                email: currentState.userForm.email.value,
                username: currentState.userForm.username.value,
                password: currentState.userForm.password.value
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: "include"
        }).then(res => {
            if (!res.ok) {
                const error = new Error("Error occured creating user account, Check if email is not already registered");
                error.title = "Sign up error"
                throw error;
            }

            return res.json()
            // eslint-disable-next-line no-unused-vars
        }).then(resData => {
            setState(prevState => {
                return { ...prevState, loading: false }
            })
            const success = new Error("Sign in to your account to proceed")
            success.title = "Successful sign up"
            navigate("/login")
            throw success

        }).catch(catchError)
    }

    const inputBlurHandler = (input) => {
        setCurrentState(prevState => {
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
        setCurrentState(prevState => {
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
                <h2>Happy to join SLaM?</h2>
                <p>Quickly create an account to post your slam and get updates on recent slams</p>
            </div>
            <div className="signup-form-control">
                <FormComponent props={{ onSubmit: currentState.formIsValid ? handleSubmitCreateAcount : null }}>
                    <div className="input-form-classes">
                        <InputComponent props={{
                            id: "fullname",
                            type: "text",
                            name: "fullname",
                            label: "Full name",
                            control: "input",
                            placeholder: "Enter your full name",
                            onChange: handleFormInputChange,
                            onBlur: () => inputBlurHandler("fullname"),
                            touched: currentState.userForm["fullname"].touched,
                            valid: currentState.userForm["fullname"].value,
                            value: currentState.userForm["fullname"].value,
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
                            touched: currentState.userForm["email"].touched,
                            valid: currentState.userForm["email"].value,
                            value: currentState.userForm["email"].value,
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
                            touched: currentState.userForm["username"].touched,
                            valid: currentState.userForm["username"].value,
                            value: currentState.userForm["username"].value,
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
                            touched: currentState.userForm["password"].touched,
                            valid: currentState.userForm["password"].value,
                            value: currentState.userForm["password"].value,

                        }} />

                    </div>
                    <ButtonComponent props={{ type: "submit", design: "raised", loading: state.loading, title: "Create account", onClick: currentState.formIsValid ? handleSubmitCreateAcount : null }} />

                </FormComponent>
            </div>
        </div>
        <div className="signup-link">
            <h3>Already have an account?</h3>
            <Link to="/login">Login</Link>
        </div>
    </div>
}