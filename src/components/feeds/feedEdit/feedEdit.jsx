/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment, useContext, useEffect, useState } from "react";
import Modal from "../../modal/modal";
import FormComponent from "../../forms.jsx/form";
import InputComponent from "../../input/input-component";
import FilePicker from "../../input/filePicker"
import MultiButtonComponent from "../../button/multiButtonComponent";
import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup";
import { generateBase64FromImage } from "../../utils/image";
import { required, length } from "../../utils/validators";
import ImagePreview from "../../image-preview-component/image-preview";
import "./feedEdit.css"
import { FeedContext } from "../../feedContextProvider/feedContextProvider";
import { Link } from "react-router-dom";
import ButtonComponent from "../../button/button";


const FeedEdit = ({ props }) => {
    const POST_FORM = {
        title: {
            value: props.statusInput || "",
            valid: false,
            touched: false,
            validators: [required, length({ min: 5 })]
        },
        image: {
            value: '',
            valid: false,
            touched: false,
            validators: [required]
        },
        content: {
            value: '',
            valid: false,
            touched: false,
            validators: [required, length({ min: 7 })]
        }
    };
    const { state, setState, catchError } = useContext(FeedContext)
    const [currentState, setCurrentState] = useState({
        base64Image: null,
        oldImageValue: null,
        postForm: POST_FORM,
        formIsValid: false,
        cancelRequest: false
    });

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

    useEffect(() => {
        if (props.selectedPost && props.isEditing) {
            setCurrentState(prevState => {
                const upDatePostForm = {
                    title: {
                        ...prevState.postForm.title,
                        value: props.selectedPost.title,
                        valid: true
                    },
                    image: {
                        ...prevState.postForm.image,
                        value: props.selectedPost.imageUrl,
                        valid: true,
                    },
                    content: {
                        ...prevState.postForm.content,
                        value: props.selectedPost.content,
                        valid: true
                    }
                }
                return { postForm: upDatePostForm, oldImageValue: props.selectedPost.imageUrl, formIsValid: true }
            })
        } else if (props.isCreateNewPost) {
            setCurrentState({ postForm: POST_FORM })
        }
    }, [])

    const cancelEditPost = () => {
        // takes true or false
        setCurrentState(prevState => {
            return {
                ...prevState, cancelRequest: !currentState.cancelRequest
            }
        })
    }
    const yesButtonFunctions = () => {
        // function to comfrim cancel of edit post
        setCurrentState({ cancelRequest: false })

        cancelPostChangeHandler()
    }


    const postInputChangeHandler = (input, value, files) => {
        if (files) {
            generateBase64FromImage(files[0]).then(B64 => {
                setCurrentState(prevState => {
                    return { ...prevState, base64Image: B64 }
                })
            }).catch(err => {
                setCurrentState(prevState => {
                    return { ...prevState, base64Image: null }
                })
            })
        }
        setCurrentState(prevState => {
            let isValid = true;
            for (const validators of prevState.postForm[input].validators) {
                isValid = isValid && validators(value)
            }

            const updatedForm = {
                ...prevState.postForm, [input]: {
                    value: files ? files[0] : value,
                    valid: isValid,
                    touched: true,
                    validators: currentState.postForm[input].validators
                }
            }
            let formIsValid = true;
            for (let inputName in updatedForm) {
                formIsValid = formIsValid && updatedForm[inputName].valid === true
            }
            return {
                ...prevState,
                postForm: updatedForm,
                formIsValid: formIsValid
            }
        })

    }

    const inputBlurHandler = (input) => {
        setCurrentState(prevState => {
            const currentInputForm = {
                ...prevState.postForm, [input]: {
                    ...prevState.postForm[input], touched: true
                }
            }
            return {
                ...prevState, postForm: currentInputForm
            }
        })
    }

    const cancelPostChangeHandler = () => {
        setCurrentState(prevState => {
            return {
                ...prevState,
                postForm: POST_FORM,
                formIsValid: false,
                base64Image: null
            }
        })
        props.cancelEditPostHandler()
    }

    const acceptPostChangeHandler = (event) => {
        event.preventDefault()
        const post = {
            title: currentState.postForm.title.value,
            image: currentState.postForm.image.value,
            oldImageValue: currentState.oldImageValue,
            content: currentState.postForm.content.value,
            base64Image: currentState.base64Image
        }
        props.finishedEditHandler(post)
        // setCurrentState(prevState => {
        //     return {
        //         ...prevState,
        //         postForm: POST_FORM,
        //         formIsValid: false,
        //         base64Image: null
        //     }
        // })
    }

    return <Fragment>
        <Modal>
            <div className="feed-edit-popup">
                <FormComponent props={{ onSubmit: acceptPostChangeHandler }} >
                    {
                        !props.isAuthenticated && <div className="signup-prompt" style={{ display: "flex", gap: "1rem", margin: "1rem auto 0rem auto" }}>
                            <p className="creat-post-reminder__authentication">You need to be signed in to create a post</p>
                            <Link to="/login">
                                <ButtonComponent props={{
                                    type: `button`,
                                    title: `Login`,
                                    link: null,
                                    onClick: null,
                                    mode: "success",
                                    design: ""
                                }} />
                            </Link>
                        </div>
                    }
                    <InputComponent props={{
                        id: "title",
                        type: "text",
                        name: "title",
                        label: "Slam title",
                        required: "required",
                        control: "input",
                        placeholder: "Enter slam feed title",
                        value: currentState.postForm.title?.value || " ",
                        touched: currentState.postForm.title?.touched || false,
                        valid: currentState.postForm.title?.valid || false,
                        onBlur: () => inputBlurHandler("title"),
                        onChange: postInputChangeHandler
                    }} />
                    <FilePicker props={{
                        id: "image",
                        type: "file",
                        label: "Post image",
                        required: "required",
                        control: "input",
                        name: "image",
                        placeholder: "Select image file",
                        touched: currentState.postForm["image"].touched || "",
                        valid: currentState.postForm["image"].valid || "",
                        // value: currentState.postForm["image"].value || "",
                        onBlur: () => inputBlurHandler("image"),
                        onChange: postInputChangeHandler
                    }} />
                    <div className="new-post__image-preview">
                        {
                            !currentState.base64Image && <p>Select file to preview</p>
                        }
                        {
                            currentState.base64Image && <ImagePreview props={{ imageURL: currentState.base64Image }} contain left />
                        }
                    </div>
                    <InputComponent props={{
                        id: "content",
                        type: "text",
                        control: "textarea",
                        label: "Comment",
                        required: "required",
                        name: "content",
                        rows: 3,
                        placeholder: "Slam post comment",
                        value: currentState.postForm.content.value || "",
                        touched: currentState.postForm.content.touched || "",
                        valid: currentState.postForm.content.valid || "",
                        onBlur: () => inputBlurHandler("content"),
                        onChange: postInputChangeHandler

                    }} />

                    <div className="post-cancel-btns">
                        <MultiButtonComponent props={{
                            buttonProperties: [
                                {
                                    buttonType: "submit", loading: state.loading, buttonTitle: state.isEditing ? "Update" : "Post", disabled: !state.isAuthenticated || !currentState.formIsValid, mode: "", design: "raised",
                                    buttonLink: null, buttonFunction: acceptPostChangeHandler
                                },
                                {
                                    buttonType: "reset", buttonTitle: "Cancel", mode: "", design: "danger",
                                    buttonLink: null, buttonFunction: cancelEditPost
                                }]
                        }} />
                    </div>
                    {currentState.cancelRequest &&
                        <ErrorCanfirmPopup
                            props={{
                                title: "Confirm cancel",
                                message: "Are you sure you want to cancel?",
                                buttonOneType: "button",
                                buttonOneTitle: "Yes",
                                buttonOneFunction: yesButtonFunctions,
                                buttonTwoType: "reset",
                                buttonTwoTitle: "No",
                                buttonTwoFunction: cancelEditPost

                            }} />
                    }
                </FormComponent>
            </div>

        </Modal>


    </Fragment>
}

export default FeedEdit