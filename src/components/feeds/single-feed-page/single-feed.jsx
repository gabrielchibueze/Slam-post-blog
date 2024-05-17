/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./single-feed.css";
import Loader from "../../loader/loader";
import { useParams, Link } from "react-router-dom";
import MultiButtonComponent from "../../button/multiButtonComponent";
import { useNavigate } from "react-router-dom/dist";
import FeedEdit from "../feedEdit/feedEdit";
import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup";
import ErrorBoundary from "../../error/error";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080")

export default function SingleFeedsPage({ props }) {
    const navigate = useNavigate()
    const postId = useParams().id
    const [state, setState] = useState({
        post: [],
        postLoading: false,
        error: null,
        isLoading: false,
        editPost: null,
        isEditing: false,
        deletePostRequest: false,
    })


    async function fetchSinglePost(url) {
        try {
            setState(prevState => {
                return { ...prevState, postLoading: true }
            });
            const response = await fetch(url);
            const data = await response.json();
            if (!data && data.post.length < 1) {
                throw new Error("Unable to fectch post details")
            }
            setState(prevState => {
                return {
                    ...prevState, post: [data.post]
                }
            });
            setState(prevState => {
                const updatePost = [...prevState.post]
                updatePost[0].imageUrl = `${data.post.imageUrl}`;

                return {
                    ...prevState, post: updatePost, postLoading: false
                }
            });
        } catch (err) {
            console.log(err)
            setState(prevState => {
                return { ...prevState, error: err, postLoading: false }
            });
        }
    }
    const startEditPostHandler = (postId) => {
        setState(prevState => {
            const loadedPost = prevState.post.find(post => post._id === postId);
            return {
                ...prevState,
                isLoading: true,
                editPost: loadedPost,
                isEditing: true
            }
        });
    }

    const cancelEditPostHandler = () => {
        setState(prevState => {
            return {
                ...prevState,
                editPost: null,
                isEditing: false,
                isCreateNewPost: false
            }
        })
    }

    const finishedEditHandler = (postData) => {
        setState(prevState => {
            return { ...prevState, editLoading: true }
        })
        let url;
        let method;
        if (state.isEditing) {
            url = `http://localhost:8080/feeds/edit/${state.editPost._id}`;
            method = "PUT"
        }
        const formData = new FormData()
        formData.append("title", postData.title);
        formData.append("content", postData.content);
        formData.append("image", postData.image);

        fetch(url, {
            method: method,
            body: formData,
            headers: {
                "Authorization": "Bearers " + props.token
            }
        }).then(res => {
            if (res.status !== 201) {
                throw new Error("Failed to create/update post", res.status)
            }
            return res.json()
        }).then(resData => {
            const currentPost = {
                _id: resData.post._id,
                creator: resData.post.creator,
                createdAt: resData.post.createdAt,
                title: resData.post.title,
                content: resData.post.content,
                imageUrl: resData.post.imageUrl
            }

            setState(prevState => {
                return {
                    ...prevState,
                    posts: currentPost,
                    isEditing: false,
                    editPost: null,
                    editLoading: false,
                    isCreateNewPost: false
                }
            })
        }).catch(err => {
            console.log(err);
            setState({
                isEditing: false,
                editLoading: false,
                isCreateNewPost: false,
                error: err,
                editPost: null
            })
        })
    }
    const trigerDeletePostRequest = (postId) => {
        setState(prevState => {
            return {
                ...prevState, toDeletePostId: postId, deletePostRequest: true
            }
        })
    }
    const yesButtonFunctions = () => {
        deletePostHandler(state.toDeletePostId)
        setState(prevState => {
            return {
                ...prevState, deletePostRequest: false, toDeletePostId: null
            }
        })

    }
    const cancelDeletetPost = () => {
        setState(prevState => {
            return {
                ...prevState, deletePostRequest: false, toDeletePostId: null
            }
        })
    }

    const deletePostHandler = (postId) => {
        setState(prevState => {
            return {
                ...prevState, postLoading: true
            }
        });
        fetch(`http://localhost:8080/feeds/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearers " + props.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error("Deleting a post failed")
                }
                return res.json()
            }).then(resData => {
                console.log(resData)
                setState(prevState => {
                    return {
                        ...prevState,
                        posts: [],
                        postsLoading: true
                    };
                });
                navigate("/")

            }).catch(catchError)
    }

    const catchError = (err) => {
        setState(prevState => {
            return {
                ...prevState, error: err
            }
        })
    }
    useEffect(() => {
        fetchSinglePost(`http://localhost:8080/feeds/posts/${postId}`)

    }, [state.isEditing])

    useEffect(() => {
        socket.on("posts", data => {
            if (data.action === "update") {
                setState(prevState => {
                    return {
                        ...prevState, post: [data.post]
                    }
                })
            }
        })
    }, [])
    if (state.postLoading) {
        return <div className="single-post-details__page">
            <Loader />
        </div>
    }
    if (state.error) {
        return <p
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
            An error occured... please try again
        </p>
    }

    console.lo

    return <div >
        <ErrorBoundary>
            {
                state.isEditing && <FeedEdit props={{
                    selectedPost: state.editPost,
                    isEditing: state.isEditing,
                    isAuthenticated: props.isAuthenticated,
                    cancelEditPostHandler: cancelEditPostHandler,
                    finishedEditHandler: finishedEditHandler
                }}
                />}
            {state.deletePostRequest &&
                <ErrorCanfirmPopup
                    props={{
                        title: "Comfirm delete",
                        message: "Are you sure you want to delete this post?",
                        buttonOneType: "button",
                        buttonOneTitle: "Yes",
                        buttonOneFunction: yesButtonFunctions,
                        buttonTwoType: "reset",
                        buttonTwoTitle: "No",
                        buttonTwoFunction: cancelDeletetPost

                    }} />
            }
            <div className="single-post-details__page">
                <Link to="/" relative="path" className="back-to-posts"><button className="back-arrow"> {"<<<"} Back to posts</button></Link>

                {!state.postLoading && state.post.length > 0 ? state.post.map((postDetail) => {
                    console.log(postDetail)
                    return <div key={postDetail._id}>
                        {
                            props.isAuthenticated && props.user?._id.toString() === postDetail.creator._id.toString() &&
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
                                        buttonFunction: () => trigerDeletePostRequest(postDetail._id)
                                    }]

                            }} />
                        }

                        <h1 className="single-post__title">{postDetail.title}</h1>
                        <p className="single-post__creator">Slam created  by
                            <span>{postDetail.creator.name}</span> on
                            {(new Date(postDetail.createdAt).toLocaleDateString("en-US")) + " " + (new Date(postDetail.createdAt).toLocaleTimeString("en-US"))}
                        </p>
                        <Link to={`http://localhost:8080/${postDetail.imageUrl}`} target="_blank">
                            <img className="single-post__image" src={`http://localhost:8080/${postDetail.imageUrl}`} />
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