/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
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


const FeedEdit = ({ props }) => {

    const POST_FORM = {
        title: {
            value: props.statusInput || '',
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

    const [state, setState] = useState({
        postForm: POST_FORM,
        formIsValid: false,
        imagePreview: null,
        cancelRequest: false
    });

    useEffect(() => {
        if (props.selectedPost && props.isEditing) {
            setState(prevState => {
                const upDatePostForm = {
                    title: {
                        ...prevState.postForm.title,
                        value: props.selectedPost.title,
                        valid: true
                    },
                    image: {
                        ...prevState.postForm.image,
                        value: props.selectedPost.imageUrl,
                        valid: true
                    },
                    content: {
                        ...prevState.postForm.content,
                        value: props.selectedPost.content,
                        valid: true
                    }
                }
                return { postForm: upDatePostForm, formIsValid: true }
            })
        } else if (props.isCreateNewPost) {
            setState({ postForm: POST_FORM })
        }
    }, [])

    const cancelEditPost = () => {
        // takes true or false
        setState(prevState => {
            return {
                ...prevState, cancelRequest: !state.cancelRequest
            }
        })
    }
    const yesButtonFunctions = () => {
        // function to comfrim cancel of edit post
        setState({ cancelRequest: false })

        cancelPostChangeHandler()
    }


    const postInputChangeHandler = (input, value, files) => {
        if (files) {
            generateBase64FromImage(files[0]).then(B64 => {
                setState(prevState => {
                    return { ...prevState, imagePreview: B64 }
                })
            }).catch(err => {
                console.log(err)
                setState(prevState => {
                    return { ...prevState, imagePreview: null }
                })
            })
        }
        setState(prevState => {
            let isValid = true;
            for (const validators of prevState.postForm[input].validators) {
                isValid = isValid && validators(value)
            }

            const updatedForm = {
                ...prevState.postForm, [input]: {
                    value: files ? files[0] : value,
                    valid: isValid,
                    touched: true,
                    validators: state.postForm[input].validators
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
        setState(prevState => {
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
        setState(prevState => {
            return {
                ...prevState,
                postForm: POST_FORM,
                formIsValid: false,
                imagePreview: null
            }
        })
        props.cancelEditPostHandler()
    }

    const acceptPostChangeHandler = (event) => {
        event.preventDefault()
        const post = {
            title: state.postForm.title.value,
            image: state.postForm.image.value,
            content: state.postForm.content.value
        }
        props.finishedEditHandler(post)
        setState(prevState => {
            return {
                ...prevState,
                postForm: POST_FORM,
                formIsValid: false,
                imagePreview: null
            }
        })
    }

    return <Fragment>
        <Modal>
            {/* {
                props.editLoading && <Loader />
            } */}
            <div className="feed-edit-popup">


                <FormComponent props={{ onSubmit: acceptPostChangeHandler }} >
                    {
                        !props.isAuthenticated && <p className="creat-post-reminder__authentication">You need to be signed in to create a post</p>
                    }
                    <InputComponent props={{
                        id: "title",
                        type: "text",
                        name: "title",
                        label: "Slam title",
                        required: "required",
                        control: "input",
                        placeholder: "Enter slam feed title",
                        value: state.postForm.title?.value || " ",
                        touched: state.postForm.title?.touched || false,
                        valid: state.postForm.title?.valid || false,
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
                        touched: state.postForm["image"].touched || "",
                        valid: state.postForm["image"].valid || "",
                        // value: state.postForm["image"].value || "",
                        onBlur: () => inputBlurHandler("image"),
                        onChange: postInputChangeHandler
                    }} />
                    <div className="new-post__image-preview">
                        {
                            !state.imagePreview && <p>Select file to preview</p>
                        }
                        {
                            state.imagePreview && <ImagePreview props={{ imageURL: state.imagePreview }} contain left />
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
                        value: state.postForm.content.value || "",
                        touched: state.postForm.content.touched || "",
                        valid: state.postForm.content.valid || "",
                        onBlur: () => inputBlurHandler("content"),
                        onChange: postInputChangeHandler

                    }} />

                    <div className="post-cancel-btns">
                        <MultiButtonComponent props={{
                            buttonProperties: [
                                {
                                    buttonType: "submit", buttonTitle: "Post/Update", disabled: !state.formIsValid, mode: "raised", design: "",
                                    buttonLink: null, buttonFunction: acceptPostChangeHandler
                                },
                                {
                                    buttonType: "reset", buttonTitle: "Cancel", mode: "", design: "danger",
                                    buttonLink: null, buttonFunction: cancelEditPost
                                }]
                        }} />
                    </div>
                    {state.cancelRequest &&
                        <ErrorCanfirmPopup
                            props={{
                                title: "Comfirm Cancel",
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