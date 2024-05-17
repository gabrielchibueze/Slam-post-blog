/* eslint-disable react/prop-types */
import MultiButtonComponent from "../button/multiButtonComponent";
import FeedEdit from "../feeds/feedEdit/feedEdit";
import InputComponent from "../input/input-component";

export default function SideBar({ props }) {

    return (
        <section className="side-bar-section">
            {props.isCreateNewPost && <FeedEdit props={{
                isEditing: props.isEditing,
                editLoading: props.editLoading,
                cancelEditPostHandler: props.cancelEditPostHandler,
                finishedEditHandler: props.finishedEditHandler,
                newPostHandler: props.newPostHandler,
                // statusInput: props.statusInput,
                isAuthenticated: props.isAuthenticated
            }} />}
            <h1>Post feed</h1>
            <div className="side-bar__form">
                <InputComponent props={{
                    id: "statusUpdate",
                    type: "text",
                    name: "createfeed",
                    control: "input",
                    placeholder: "Update your status",
                    value: props.statusInput,
                    onChange: props.statusInputChangeHandler
                }} />
                <MultiButtonComponent props={{
                    buttonProperties: [
                        {
                            buttonType: "button", buttonTitle: props.statusInput.trim().length > 1 ? "Update status" : "New feed", mode: "raised", design: "",
                            buttonLink: null, buttonFunction: props.statusInput.trim().length > 1 ? props.statusUpdateHandler : props.createNewPost
                        }]
                }} />
            </div>
        </section>
    )
}
