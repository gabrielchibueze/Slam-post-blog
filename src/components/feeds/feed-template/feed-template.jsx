/* eslint-disable react/prop-types */
import { Fragment, useContext, useEffect, useState } from "react";
import MultiButtonComponent from "../../button/multiButtonComponent";
import "./feed-template.css"
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FeedContext } from "../../feedContextProvider/feedContextProvider";

export default function FeedTemplate({ props }) {
    const { state, setState, likePost, followUser, emitContent, catchError } = useContext(FeedContext)
    const [currentState, setCurrentState] = useState({
        postLikes: props.likes,
        isLiked: false,
        postId: null,
        creatorId: null,
        followings: [],
        isFollowing: false,
        likedPostHistory: []
    })
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
        let usersLikedPost = state.currentUser?.likedPosts
        if (state.isAuthenticated) {
            let usersAllLiked = [];
            if (usersLikedPost && usersLikedPost.length > 0) {
                for (let i = 0; i <= usersLikedPost.length; i++) {
                    usersAllLiked.push(usersLikedPost[i])
                }
            }
            setCurrentState(prevState => {
                return {
                    ...prevState, likedPostHistory: usersAllLiked
                }
            })
        }
    }, [state])

    function clickOnLike(postId, likeOrDislike) {
        try {
            if (!state.isAuthenticated) {
                const error = new Error("Please sign in to add post to favorites.")
                error.title = "Unauthorized access"
                throw error
            }
            likePost(postId, likeOrDislike)
            if (likeOrDislike === "like") {
                setCurrentState(prevState => {
                    return { ...prevState, postLikes: prevState.postLikes + 1, isLiked: true, postId: postId }
                })
                setState(prevState => {
                    return {
                        ...prevState, likes: prevState.likes + 1

                    };
                });
            }
            if (likeOrDislike === "dislike") {
                setCurrentState(prevState => {
                    return { ...prevState, postLikes: prevState.postLikes - 1, isLiked: false }
                })
                currentState.likedPostHistory.pop(postId);
                setState(prevState => {
                    return {
                        ...prevState, likes: prevState.likes - 1

                    }
                });
            }
        } catch (err) {
            catchError(err)
        }
    }

    
    useEffect(() => {
        let usersFollowing = state.currentUser?.following
        if (state.isAuthenticated) {
            let checkIsFollowing = []
            if (usersFollowing && usersFollowing.length > 0) {
                for (let i = 0; i <= usersFollowing.length; i++) {
                    checkIsFollowing.push(usersFollowing[i])
                }
            }
            setCurrentState(prevState => {
                return {
                    ...prevState, followings: checkIsFollowing
                }
            })
        }
    }, [state])


    function handleFollowUser(followOrUnfollow, followedUserId) {
        setState(prevState => {
            return { ...prevState, follow: prevState.follow + 1 }
        })

        try {
            if (!state.isAuthenticated) {
                const error = new Error("Please sign in to follow user")
                error.title = "Unauthorized access"
                throw error
            }
            followUser(followOrUnfollow, followedUserId)
            if (followOrUnfollow === "follow") {
                setCurrentState(prevState => {
                    return {
                        ...prevState,
                        isFollowing: true,
                        creatorId: followedUserId
                    }
                })
            }
            if (followOrUnfollow === "unfollow") {
                setCurrentState(prevState => {
                    return { ...prevState, isFollowing: false }
                })
                currentState.followings.pop(followedUserId)
            }
            setState(prevState => {
                return { ...prevState, follow: prevState.follow - 1 }
            })

        } catch (err) {
            catchError(err)
        }
    }
    return <Fragment>
        <div className="slam-feed-section">
            <div className="feed-template__top-section">
                <div className="post-links">
                    <p className="author-date__section">Slammed by
                        <span className="posted-by">
                            <Link to={props.creatorId ? `/user/${props.creatorId}` : ""} style={{ color: "rgb(37, 13, 75)", textDecoration: "underline" }}>{props?.creator|| "Anonymuous User"}</Link>
                        </span>
                        <span className="createdAt-time">on {props?.createdAt || "23/04/2024"}</span>
                    </p>
                </div>
                {state.user?._id !== props.creatorId && <div>
                    {
                        currentState.followings.find(user => user === props.creatorId) || currentState.isFollowing && currentState.creatorId === props.creatorId ?
                            <p className="follow__unfollow follow_unfollow-extras" onClick={() => handleFollowUser("unfollow", props.creatorId)}>Unfollow</p> :
                            <p className="follow__unfollow follow_unfollow-extras" onClick={() => handleFollowUser("follow", props.creatorId)}>Follow</p>
                    }
                </div>
                }

            </div>

            <hr />
            <div className="content-section">
                <Link className="post-links"
                    to={`/feeds/${props.postId}`}>
                    <img className="source-image" crossOrigin="" src={props.image} />
                </Link>
                <div className="post-section">
                    <Link className="post-links"
                        to={`/feeds/${props.postId}`}>
                        <h2 className="post-title">
                            {/* {emitContent(20, props.title) || "Message title"} */}
                            {(props.title) || "Message title"}
                            </h2>
                    </Link>
                    {
                        props.content ? <p>{emitContent(40, props.content)}</p> :
                            <p>Message Snippt goes here. This is the message content. Click to view the message details</p>
                    }
                    <div className="buttons__feed-templates">
                        <div className="like-section">
                            <div className="like-buttons">
                                {currentState.likedPostHistory.find(post => post === props.postId) || currentState.isLiked && currentState.postId === props.postId ?
                                    <p className="like" onClick={() => clickOnLike(props.postId, "dislike")}><FaHeart /></p> :
                                    <p className="dislike" onClick={() => clickOnLike(props.postId, "like")}><FaRegHeart /></p>
                                }
                            </div>
                            <p>{currentState.postLikes} Like<span>{currentState.postLikes <= 1 ? "" : "s"}</span></p>
                        </div>
                        <MultiButtonComponent props={{
                            buttonProperties: [
                                { buttonType: "button", buttonTitle: "View", mode: "", design: "raised", buttonLink: `/feeds/${props.postId}`, buttonFunction: null },
                                { buttonType: "button", buttonTitle: props.isAuthenticated && props.userId === props.postUserId ? "Edit" : "", mode: "", design: "raised", buttonLink: null, buttonFunction: props.startEditPostHandler },
                                { buttonType: "reset", buttonTitle: props.isAuthenticated && props.userId === props.postUserId ? "Delete" : "", mode: "", design: "danger", buttonLink: null, buttonFunction: props.deletePostHandler }]

                        }} />

                    </div>
                </div>
            </div>

        </div >
    </Fragment >
}