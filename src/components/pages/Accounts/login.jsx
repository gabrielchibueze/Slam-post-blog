/* eslint-disable react/prop-types */
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


export default function LoginPage(props) {
    const {
        state,
        setState,
        catchError
    } = useContext(FeedContext)
    useEffect(()=>{
        window.scrollTo({
            top: 0
        })
    }, [])
    const [currentState, setCurrentState] = useState({
        loading: false,
        userForm: USER_FORM,
        formIsValid: false
    })
    const navigate = useNavigate()

    // useEffect(() => {
    //     fetch('https://slampost-8dd6d1d06367.herokuapp.com/slam/csrf-token')
    //       .then(response => response.json())
    //       .then(data => {
    //         setState(prevState => {
    //           return {
    //             ...prevState, csrfToken: data.csrfToken
    //           }
    //         })
    //       }
    //       ).catch(catchError);
    //   }, []);
    //   console.log(state.csrfToken)

    const handleSubmitCreateAcount = (event) => {
        event.preventDefault();
        setState(prevState => {
            return { ...prevState, loading: true }
        })

        fetch("https://slampost-8dd6d1d06367.herokuapp.com/auth/login", {
            method: "put",
            body: JSON.stringify({
                email: currentState.userForm.email.value,
                password: currentState.userForm.password.value
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: 'include',
        }).then(res => {
            if (!res.ok) {
                const error = new Error("Invalid login details... check if login details are correct");
                error.title = "Login error"
                navigate("/login")
                throw error;
            }
            else {
                return res.json()
            }
        }).then(resData => {
            props.confirmSubmitLogin(resData)
            setState(prevState => {
                return { ...prevState, loading: false }
            })
            navigate("/")
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
                <h2>Welcome back to SLaM!!</h2>
                <p>Login into your account to access your slam posts and get recent updates in the SLaM community</p>
            </div>
            <div className="signup-form-control">
                <FormComponent props={{ onsubmit: currentState.formIsValid ? handleSubmitCreateAcount : null }}>
                    <div className="input-form-classes">
                        <InputComponent props={{
                            id: "email",
                            type: "email",
                            name: "email",
                            label: "Email",
                            control: "input",
                            placeholder: "Enter your email",
                            onBlur: () => inputBlurHandler("email"),
                            onChange: handleFormInputChange,
                            value: currentState.userForm["email"].value,
                            valid: currentState.userForm["email"].valid,
                            touched: currentState.userForm["email"].touched

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
                            value: currentState.userForm["password"].value,
                            valid: currentState.userForm["password"].valid,
                            touched: currentState.userForm["password"].touched

                        }} />

                    </div>
                    <ButtonComponent props={{ type: "submit", title: "Login", design: "raised", loading: state.loading, onClick: currentState.formIsValid ? handleSubmitCreateAcount : null }} />
                    <Link to="/password-reset">Forgotten your password?</Link>
                </FormComponent>

            </div>
        </div>
        <div className="signup-link">
            <h3>New to SLaM?</h3>
            <Link to="/signup">Sign up</Link>
        </div>

    </div>
}