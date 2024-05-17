/* eslint-disable react/prop-types */
import { Fragment } from "react";
import MultiButtonComponent from "../../button/multiButtonComponent";
import "./feed-template.css"
import { Link } from "react-router-dom";
export default function FeedTemplate({ props }) {
    return <Fragment>

        <div className="slam-feed-section">
            <div className="top-section">
                <Link className="post-links">
                    <p >Slammed by
                        {
                            <span className="posted-by">{props?.creator || "Anonymuous User"}</span>
                        }
                        on
                        <span>{props?.createdAt || "23/04/2024"}</span>
                    </p>
                </Link>
            </div>

            <hr />
            <section >
                <Link className="post-links"
                    to={`/feeds/${props.postId}`}>
                    <h2 className="post-title">{props?.title || "Message title"}</h2>
                </Link>
                {
                    props.content ? <p>{props.content}</p> :
                        <p>Message Snippt goes here. This is the message content. Click to view the message details</p>
                }
                <MultiButtonComponent props={{
                    buttonProperties: [
                        { buttonType: "button", buttonTitle: "View", mode: "raised", design: "", buttonLink: `/feeds/${props.postId}`, buttonFunction: null },
                        { buttonType: "button", buttonTitle: props.isAuthenticated && props.userId === props.postUserId ? "Edit" : "", mode: "flat", design: "", buttonLink: null, buttonFunction: props.startEditPostHandler },
                        { buttonType: "reset", buttonTitle: props.isAuthenticated && props.userId === props.postUserId ? "Delete" : "", mode: "", design: "danger", buttonLink: null, buttonFunction: props.deletePostHandler }]

                }} />
            </section>

        </div >
    </Fragment >
}