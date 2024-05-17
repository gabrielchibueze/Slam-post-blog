/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom";
import "./all-feed.css"
import FeedTemplate from "../feed-template/feed-template";
import Paginator from "../../paginator/paginator";
import Loader from "../../loader/loader";
import SideBar from "../../outlet/side-bar";
import FeedEdit from "../feedEdit/feedEdit";
import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup";
import ErrorBoundary from "../../error/error";
const socket = io("http://localhost:8080");


const AllFeedsPage = ({ props }) => {
    const [state, setState] = useState({
        posts: [],
        statusInput: "",
        statusUpdate: null,
        totalPosts: null,
        isAuth: false,
        editPost: null,
        isEditing: false,
        editLoading: false,
        isCreateNewPost: false,
        deletePostRequest: false,
        toDeletePostId: null,
        postPage: 1,
        postsLoading: true,
        itemsPerPage: 5,
        statusCode: "",
        error: null
    });
    const navigate = useNavigate()

    useEffect(() => {
        loadPosts()
    }, [state.postPage])

    useEffect(() => {
        socket.on("posts", data => {
            if (data.action === "create") {
                addPost(data.post)
            }
            else if (data.action === "update") {
                editPost(data.post)
            } else if (data.action === "delete") {
                loadPosts()
            }
        })
        return () => {
            socket.off()
        }
    }, [])

    const addPost = (post) => {
        setState(prevState => {
            let updatedPost = prevState.posts ? [...prevState.posts] : [];
            updatedPost.pop()
            updatedPost.unshift(post)
            return {
                ...prevState,
                posts: updatedPost,
                totalPosts: prevState.totalPosts + 1
            }
        })
    }
    const editPost = (post) => {
        setState(prevState => {
            let updatedPost = prevState.posts ? [...prevState.posts] : []
            let updatedPostIndex = prevState.posts.findIndex(pst => pst._id === post._id)
            updatedPost[updatedPostIndex] = post;
            return {
                ...prevState,
                posts: updatedPost,
            }
        })

    }

    const loadPosts = (direction) => {
        if (direction) {
            setState(prevState => {
                return {
                    ...prevState, postsLoading: true, posts: []
                }
            })
        }
        let page = state.postPage

        if (direction === "next") {
            page++;
            setState(prevState => {
                return { ...prevState, postPage: page }
            })
        }
        if (direction === "previous") {
            page--;
            setState(prevState => {
                return { ...prevState, postPage: page }
            })
        }

        fetch(`http://localhost:8080/feeds/posts?limit=${state.itemsPerPage}&page=${state.postPage}`).then(res => {
            if (res.status !== 200) {
                throw new Error("Error occcured fetching post")
            }
            return res.json()
        }).then(resData => {
            setState(prevState => {
                return {
                    ...prevState,
                    posts: resData.posts,
                    totalPosts: resData.totalItems,
                    postsLoading: false
                }
            })
        }).catch(catchError)
    };

    const catchError = (error) => {
        setState(prevState => {
            return { ...prevState, error: error }
        })
    };

    const errorHandler = () => {
        setState(prevState => {
            return { ...prevState, error: null }
        })
    }

    const statusUpdateHandler = () => {
        let url = "http://localhost:8080/feeds/status"
        fetch(url, {
            method: "PATCH",
            body: JSON.stringify({
                status: state.statusInput
            }),
            headers: {
                "Content-Type": "Application/json",
                "Authorization": "Bearer " + props.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    const error = new Error("Error occured updating user status");
                    error.status = res.status
                    throw error
                }
                return res.json()
            })
            .then(resData => {
                setState(prevState => {
                    return {
                        ...prevState, userStatus: resData.userStatus, statusInput: ""
                    }
                })
            }).catch(catchError)
    }

    const createNewPost = () => {
        setState(prevState => {
            return {
                ...prevState,
                isCreateNewPost: true
            }
        })
    }
    const startEditPostHandler = (postId) => {
        setState(prevState => {
            const loadedPost = prevState.posts.find(post => post._id === postId);
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
        console.log(props.token)
        if (!props.isAuthenticated) {
            navigate("/login")
        }
        setState(prevState => {
            return { ...prevState, editLoading: true }
        })
        let url = "http://localhost:8080/feeds/post"
        let method = "post"

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
                // let updatedPost = prevState.posts ? [...prevState.posts] : []

                // if (prevState.editPost && prevState.posts.length >= 1) {
                //     let updatedPostIndex = prevState.posts.findIndex(post => post._id === prevState.editPost._id)
                //     updatedPost[updatedPostIndex] = currentPost;
                // }
                // else if (prevState.isCreateNewPost) {
                //     updatedPost.push(currentPost)
                // }

                return {
                    ...prevState,
                    // posts: updatedPost,
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

    const statusInputChangeHandler = (input, value) => {
        setState(prevState => {
            return {
                ...prevState, statusInput: value
            }
        })
    }

    const deletePostHandler = (postId) => {
        setState(prevState => {
            return {
                ...prevState, postsLoading: true
            }
        });
        fetch(`http://localhost:8080/feeds/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearers " + props.token
            }
        }).then(res => {
            if (res.status !== 200 || res.status !== 201) {
                throw new Error("Deleting a post failed")
            }
            return res.json()
        }).then(resData => {
            setState(prevState => {
                // let updatedDeletedPosts = prevState.posts.filter(posts => posts._id !== postId)
                return {
                    ...prevState,
                    postsLoading: false
                };
            });
        }).catch(catchError)
    }
    const deletePostRequest = (postId) => {
        setState(prevState => {
            return {
                ...prevState, deletePostRequest: true, toDeletePostId: postId
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
    const yesButtonFunctions = (postId) => {
        deletePostHandler(state.toDeletePostId)
        setState(prevState => {
            return {
                ...prevState, deletePostRequest: false, toDeletePostId: null
            }
        })

    }

    return (
        <Fragment>
            <ErrorBoundary>
                <div className="displayed-outlet">
                    <SideBar props={{
                        isAuthenticated: props.isAuthenticated,
                        isCreateNewPost: state.isCreateNewPost,
                        editLoading: state.editLoading,
                        cancelEditPostHandler: cancelEditPostHandler,
                        finishedEditHandler: finishedEditHandler,
                        createNewPost: createNewPost,
                        statusInput: state.statusInput,
                        statusUpdateHandler: statusUpdateHandler,
                        statusInputChangeHandler: statusInputChangeHandler,
                    }} />
                    <div className="main-outlet">
                        {state.isEditing && <FeedEdit props={{
                            isAuthenticated: props.isAuthenticated,
                            selectedPost: state.editPost,
                            isEditing: state.isEditing,
                            editLoading: state.editLoading,
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


                        <section className="">
                            <h1 style={{ marginTop: "1rem", marginBottom: "2rem" }}>All Feeds</h1>
                            {state.postsLoading ?
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Loader />
                                </div> :
                                <div>
                                    {
                                        state.posts && state.posts.length === 0 ?
                                            <h3 style={{ textAlign: "center", marginTop: "20%" }}>No posts found</h3> :

                                            <Paginator props={{
                                                itemsPerPage: state.itemsPerPage,
                                                totalPosts: state.totalPosts,
                                                postPage: state.postPage,
                                                onPreviousPage: () => loadPosts("previous"),
                                                onNextPage: () => loadPosts("next"),
                                            }}>
                                                <div>
                                                    <main className="all-slam-posts" key="1">
                                                        {state.posts && state.posts.map((post) => {
                                                            return (
                                                                <div key={post._id}>
                                                                    <FeedTemplate props={{
                                                                        postId: post._id,
                                                                        title: post.title,
                                                                        image: post.imageUrl,
                                                                        content: post.content,
                                                                        createdAt: new Date(post.createdAt).toLocaleDateString() + " " + new Date(post.createdAt).toLocaleTimeString("en-US"),
                                                                        creator: post.creator?.username,
                                                                        userId: props.user?._id || null,
                                                                        postUserId: post.creator?._id || null,
                                                                        isAuthenticated: props.isAuthenticated,
                                                                        deletePostHandler: () => deletePostRequest(post._id),
                                                                        startEditPostHandler: () => startEditPostHandler(post._id)
                                                                    }} />
                                                                </div>
                                                            )
                                                        })}
                                                    </main>
                                                </div>
                                            </Paginator>
                                    }
                                </div>
                            }

                        </section>

                    </div>
                </div >

            </ErrorBoundary>
        </Fragment >
    )
}


export default AllFeedsPage
