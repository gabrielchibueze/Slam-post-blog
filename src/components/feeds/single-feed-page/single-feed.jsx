/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import "./single-feed.css";
import Loader from "../../loader/loader";
import { useParams, Link } from "react-router-dom";
import MultiButtonComponent from "../../button/multiButtonComponent";
import { useNavigate } from "react-router-dom/dist";
import FeedEdit from "../feedEdit/feedEdit";
import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup";
import ErrorBoundary from "../../error/error";
import { io } from "socket.io-client";
import { FeedContext } from "../../feedContextProvider/feedContextProvider";
import { FaHeart, FaRegHeart } from "react-icons/fa";
const socket = io("https://slampost-8dd6d1d06367.herokuapp.com")

export default function SingleFeedsPage() {
    const { startEditPostHandler,
        cancelEditPostHandler,
        finishedEditHandler,
        deletePostRequest,
        yesButtonFunctions,
        cancelDeletetPost,
        catchError,
        state,
        followUser,
        likePost,
        createdAt,
        setState
    } = useContext(FeedContext)


    const navigate = useNavigate()
    const postId = useParams().id
    const [currentState, setCurrentState] = useState({
        error: null,
        post: [],
        postLikes: null,
        isLiked: false,
        postId: null,
        likedPostHistory: [],
        followings: []
    })
    useEffect(() => {
        window.scrollTo({
            top: 0
        })
    }, [])

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
                    }
                })
                setState(prevState => {
                    return { ...prevState, follow: prevState.follow + 1 }
                })
            }
            if (followOrUnfollow === "unfollow") {
                setCurrentState(prevState => {
                    return { ...prevState, isFollowing: false }
                })
                currentState.followings.pop(followedUserId)
                setState(prevState => {
                    return { ...prevState, follow: prevState.follow - 1 }
                })
            }
        } catch (err) {
            catchError(err)
        }
    }
    function clickOnLike(postId, likeOrDislike) {
        try {
            if (!state.isAuthenticated) {
                const error = new Error("Please sign in to add post to favorites.")
                error.title = "Unauthorized access"
                throw error
            }
            if (likeOrDislike === "like") {
                setCurrentState(prevState => {
                    return { ...prevState, postLikes: prevState.postLikes + 1, isLiked: true, postId: postId }
                })
            }
            if (likeOrDislike === "dislike") {
                setCurrentState(prevState => {
                    return { ...prevState, postLikes: prevState.postLikes - 1, isLiked: false }
                })
                currentState.likedPostHistory.pop(postId)
            }
            likePost(postId, likeOrDislike)
        } catch (err) {
            catchError(err)
        }
    }

    async function fetchSinglePost() {
        try {
            setState(prevState => {
                return { ...prevState, postLoading: true }
            });
            const response = await fetch(`https://slampost-8dd6d1d06367.herokuapp.com/feeds/posts/${postId}`);
            const data = await response.json();
            if (!data && data.post.length < 1) {
                throw new Error("Unable to fectch post details")
            }

            setCurrentState(prevState => {
                const adjustedPost = {
                    ...data.post,
                    imageUrl: data.post.imageUrl
                }
                return {
                    ...prevState, post: [adjustedPost], postLoading: false, postLikes: adjustedPost.likes.length
                }
            });
            setState(prevState => {
                return { ...prevState, postLoading: false }
            })

        } catch (err) {
            catchError(err)
            setState(prevState => {
                return { ...prevState, postLoading: false }
            });
        }
    }
    const completedEditing = async (postData) => {
        try {
            if (!state.isAuthenticated) {
                navigate("/login")
                throw Error("You must login in to continue")
            }
            finishedEditHandler(postData)
        }
        catch (err) {
            catchError(err)
        }
    }
    const completedDelete = async () => {
        await yesButtonFunctions()
        navigate("/")
    }

    useEffect(() => {
        fetchSinglePost()
    }, [state.isEditing])

    useEffect(() => {
        socket.on("posts", data => {
            if (data.action === "update") {
                setCurrentState(prevState => {
                    return {
                        ...prevState, post: [data.post]
                    }
                })
            }
        })
    }, [])

    function goBack() {
        navigate(-1)
    }
    if (state.postLoading) {
        return <div className="single-post-details__page">
            <Loader />
        </div>
    }
    if (currentState.error) {
        return <p
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
            An error occured... please try again
        </p>
    }


    return <div >
        <ErrorBoundary>
            {
                state.isEditing && <FeedEdit props={{
                    selectedPost: state.editPost,
                    isEditing: state.isEditing,
                    isAuthenticated: state.isAuthenticated,
                    cancelEditPostHandler: cancelEditPostHandler,
                    finishedEditHandler: completedEditing
                }}
                />}
            {state.deletePostRequest &&
                <ErrorCanfirmPopup
                    props={{
                        title: "Comfirm delete",
                        message: "Are you sure you want to delete this post?",
                        buttonOneType: "button",
                        buttonOneTitle: "Yes",
                        buttonOneFunction: completedDelete,
                        buttonTwoType: "reset",
                        buttonTwoTitle: "No",
                        buttonTwoFunction: cancelDeletetPost

                    }} />
            }
            <div className="single-post-details__page">
                <Link className="back-to-posts"><button className="back-arrow" onClick={goBack}> {"<<<"} Back to posts</button></Link>

                {currentState.post ? currentState.post.map((postDetail) => {
                    return <div key={postDetail._id}>
                        <div className="top-like__delete-section">
                            <div className="like-section">
                                <div className="like-buttons">
                                    {currentState.likedPostHistory.find(post => post === postDetail._id) || currentState.isLiked && currentState.postId === postDetail._id ?
                                        <p className="like" onClick={() => clickOnLike(postDetail._id, "dislike")}><FaHeart /></p> :
                                        <p className="dislike" onClick={() => clickOnLike(postDetail._id, "like")}><FaRegHeart /></p>
                                    }
                                </div>
                                <p>{currentState.postLikes} Likes</p>
                            </div>
                            {postDetail.creator._id !== state.user?._id && <div>
                                {
                                    currentState.followings?.length && currentState.followings.find(user => user === postDetail.creator._id) || currentState.isFollowing ?
                                        <p className="follow__unfollow" onClick={() => handleFollowUser("unfollow", postDetail.creator._id)}>Unfollow</p> :
                                        <p className="follow__unfollow" onClick={() => handleFollowUser("follow", postDetail.creator._id)}>Follow +</p>
                                }
                            </div>
                            }

                            {
                                state.isAuthenticated && state.user?._id.toString() === postDetail.creator._id.toString() &&

                                <MultiButtonComponent props={{
                                    buttonProperties: [
                                        {
                                            buttonType: "button", buttonTitle: "Edit", mode: "flat",
                                            design: "",
                                            buttonLink: null,
                                            buttonFunction: () => startEditPostHandler(postDetail._id)
                                        },
                                        {
                                            buttonType: "reset", buttonTitle: "Delete", mode: "",
                                            design: "danger",
                                            buttonLink: null,
                                            buttonFunction: () => deletePostRequest(postDetail._id)
                                        }]

                                }} />

                            }
                        </div>

                        <h1 className="single-post__title">{postDetail.title}</h1>
                        <p className="single-post__creator">Slam created  by
                            <span className="posted-by">
                                <Link to={`/user/${postDetail.creator._id}`} style={{ color: "rgb(37, 13, 75)", border: "1px solid grey", padding: "0.1rem", marginRight: "4px", marginLeft: "4px", borderRadius: "0.2rem" }}>{postDetail.creator.username || "Anonymuous User"}</Link>
                            </span>
                            on
                            {" " + createdAt(postDetail.createdAt)}
                        </p>
                        <Link to={postDetail.imageUrl} target="_blank">
                            <img crossOrigin="ananymous" className="single-post__image" src={postDetail.imageUrl} />
                        </Link>
                        <p className="single-post__content" >{postDetail.content}</p>
                    </div>
                })
                    : <h2>Unable to fetch post details... It seems Post has been deleted</h2>
                }

            </div>
        </ErrorBoundary>
    </div>
}