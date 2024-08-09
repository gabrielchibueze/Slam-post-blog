import ErrorBoundary from "../error/error";
import { useContext, useState } from "react";
import ButtonComponent from "../button/button";
import { FeedContext } from "../feedContextProvider/feedContextProvider";
import InputComponent from "../input/input-component";
import { isEmail, length, required } from "../utils/validators";
import FooterMobileMenu from "./footer-mobile-menu";

const USER_FORM = {
    emailaddress: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, isEmail]
    },
    name: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 3 })]
    },
    enquiry: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
    }
}

export default function Footer() {
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

    const handleSubmitenquiry = (event) => {
        event.preventDefault();
        setState(prevState => {
            return { ...prevState, loading: true }
        })
        fetch("https://slampost-8dd6d1d06367.herokuapp.com/enquiry", {
            method: "put",
            body: JSON.stringify({
                userId: state.user._id || null,
                name: currentState.userForm.name.value,
                emailaddress: currentState.userForm.emailaddress.value,
                enquiry: currentState.userForm.enquiry.value,
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: "include"
        }).then(res => {
            console.log(res)
            if (!res.ok) {
                const error = new Error("Error submitting your enquiry, Please try again");
                error.title = "Error submitting enquiry"
                throw error;
            }
            return res.json()
            // eslint-disable-next-line no-unused-vars
        }).then(resData => {
            setCurrentState(prevState => {
                return {
                    ...prevState, userForm: USER_FORM
                }
            })
            setState(prevState => {
                return { ...prevState, loading: false }
            });

            const success = new Error("Your enquiry was successfully submited, we will get back to you soon.");
            success.title = "Enquiry success"
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


    return (
        <ErrorBoundary>
            <div className="footer">
                <div className="footer-top">
                    <div className="subscription">
                        <h1>Got any questions?<span> Submit a quick form</span></h1>
                        <form onSubmit={handleSubmitenquiry} className="subscription-form">
                            <InputComponent props={{
                                id: "name",
                                type: "text",
                                name: "name",
                                control: "input",
                                placeholder: "Full name",
                                onChange: handleFormInputChange,
                                onBlur: () => inputBlurHandler("name"),
                                touched: currentState.userForm["name"].touched,
                                valid: currentState.userForm["name"].valid,
                                value: currentState.userForm["name"].value,
                            }} />
                            <InputComponent props={{
                                id: "emailaddress",
                                type: "emailaddress",
                                name: "emailaddress",
                                control: "input",
                                placeholder: "Email address",
                                onChange: handleFormInputChange,
                                onBlur: () => inputBlurHandler("emailaddress"),
                                touched: currentState.userForm["emailaddress"].touched,
                                valid: currentState.userForm["emailaddress"].valid,
                                value: currentState.userForm["emailaddress"].value,
                            }} />

                            <InputComponent props={{
                                id: "enquiry",
                                type: "text",
                                control: "textarea",
                                required: "required",
                                name: "enquiry",
                                rows: 3,
                                placeholder: "Enter your enquiry",
                                value: currentState.userForm.enquiry.value,
                                touched: currentState.userForm.enquiry.touched,
                                valid: currentState.userForm.enquiry.valid,
                                onBlur: () => inputBlurHandler("enquiry"),
                                onChange: handleFormInputChange

                            }} />
                            <ButtonComponent props={{
                                type: "submit",
                                title: `Submit`,
                                link: null,
                                loading: state.loading,
                                onClick: handleSubmitenquiry,
                                mode: "flat",
                                design: "success"
                            }} />

                        </form>
                        <p>SLAM will never share or spam your emailaddress address. By clicking &quot;Subscribe&quot; you agree to the Terms of Use and Privacy Policy</p>
                    </div>
                    <FooterMobileMenu/>
                </div>
                <div className="footer-foot">
                    <h1>New Era Web Services</h1>
                    {/* <h1>Gabriel</h1> */}
                    <p>Newcastle United Kingdom</p>
                </div>
            </div>
        </ErrorBoundary>
    )

}
