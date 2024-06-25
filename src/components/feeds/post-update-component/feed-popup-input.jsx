/* eslint-disable react/prop-types */
import { useState } from "react";
import "./feed-popup-input.css"
import FormComponent from "../../forms.jsx/form";
import InputComponent from "../../input/input-component";
import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup";
import MultiButtonComponent from "../../button/multiButtonComponent";

export default function PostUpdateFeedComponent({ props }) {
    const [comfirm, setComfirm] = useState(false);

    function setCancel() {
        setComfirm(prev => !prev)
    }
    function yesButtonFunctioons() {
        setComfirm(false);
        props.showFormComponent()
    }

    return <div className="post-update-component">
        <FormComponent props={{ method: "Post", action: "" }}>
            <label htmlFor="title">Slam Titile</label>
            <InputComponent props={{ type: "text", name: "title", id: "title", placeholder: "Enter slam feed title" }} />
            <label htmlFor="fullname">Post image</label>
            <InputComponent props={{ type: "file", label: "input", name: "image", id: "image", placeholder: "Select image file" }} />
            <label htmlFor="comment">Comment</label>
            <textarea className="post-update__comment-text-area" id="comment" name="comment" placeholder="Comment on your slam feed" ></textarea>

            <div className="post-cancel-btns">
                <MultiButtonComponent props={{
                    buttonOneType: "submit",
                    buttonTwoType: "reset",
                    buttonOneTitle: "Post/Update",
                    buttonTwoTitle: "Cancel",
                    buttonOneFunctions: () => { },
                    buttonTwoFunctions: setCancel
                }} />
            </div>
            {comfirm &&
                <ErrorCanfirmPopup
                    props={{
                        title: "Confirm cancel",
                        message: "Are you sure you want to cancel?",
                        buttonOneType: "button",
                        buttonOneTitle: "Yes",
                        buttonOneFunctions: yesButtonFunctioons,
                        buttonTwoType: "reset",
                        buttonTwoTitle: "No",
                        buttonTwoFunctions: setCancel
                    }} />
            }
        </FormComponent>
    </div>
}