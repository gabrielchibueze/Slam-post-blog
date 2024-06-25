/* eslint-disable react/prop-types */
import { useContext } from "react";
import MultiButtonComponent from "../button/multiButtonComponent";
import FeedEdit from "../feeds/feedEdit/feedEdit";
import InputComponent from "../input/input-component";
import { FeedContext } from "../feedContextProvider/feedContextProvider";
import { RiRadioButtonLine } from "react-icons/ri";

export default function SideBar({ props }) {

    const { state } = useContext(FeedContext)
    return (
        <div className="side-bar-section">
            {props.isCreateNewPost && <FeedEdit props={{
                isEditing: props.isEditing,
                editLoading: props.editLoading,
                cancelEditPostHandler: props.cancelEditPostHandler,
                finishedEditHandler: props.finishedEditHandler,
                newPostHandler: props.newPostHandler,
                isAuthenticated: props.isAuthenticated
            }} />}
            <div className="sub-section">
                <h1>Post feed</h1>
                <div className="status-update__input">
                    <InputComponent props={{
                        id: "statusUpdate",
                        type: "text",
                        name: "createfeed",
                        control: "input",
                        placeholder: "Update your status",
                        value: props.statusInput,
                        onChange: props.statusInputChangeHandler
                    }} />
                </div>
                <div style={{width: "100%", textAlign: "center", display: "flex", justifyContent: "center", marginTop: "0.2rem"}}>
                    <MultiButtonComponent props={{
                        buttonProperties: [
                            {
                                buttonType: "button", loading: state.loading, buttonTitle: props?.statusInput && props.statusInput.length > 2 ? "Update status" : "New feed", mode: "", design: "raised",
                                buttonLink: null, buttonFunction: props?.statusInput && props.statusInput.length > 2 ? props.statusUpdateHandler : props.createNewPost
                            }]
                    }} />
                </div>
            </div>
            <div className="status-section">
                {state.isAuthenticated ?
                    <div className="user-status">
                        <h3>Status: <span className="active-indicator"><RiRadioButtonLine /></span>{state.isAuthenticated && " Online"}</h3>
                        <p>{state.user.status || state.userStatus || "No user status"}</p>
                    </div> :
                    <div className="user-status">
                        <h3>Status: <span className="active-indicator offline-indicator"><RiRadioButtonLine /></span>{!state.isAuthenticated && " Offline"}</h3>
                        <p>Sign in to view status</p>
                    </div>
                }
            </div>
        </div>
    )
}
