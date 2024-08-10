/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const FeedContext = createContext()

export default function FeedContextProvider({ children }) {
    const [state, setState] = useState({
        csrfToken: null,
        loading: false,
        posts: [],
        likes: 0,
        follow: 0,
        slammersPosts: [],
        statusInput: "",
        statusUpdate: null,
        userStatus: null,
        active: true,
        totalPosts: null,
        isAuthenticated: false,
        token: null,
        sessionId: null,
        user: {
            _id: null,
            username: "",
            status: ""
        },
        currentUser: {},
        editPost: null,
        isEditing: false,
        editLoading: false,
        isCreateNewPost: false,
        isDeletePostRequest: false,
        toDeletePostId: null,
        postPage: 1,
        postsLoading: true,
        itemsPerPage: 15,
        statusCode: "",
        error: [],
        mobileView: false, desktopView: false, miniDesktop: false
    });

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

        fetch(`https://slampost-8dd6d1d06367.herokuapp.com/feeds/posts?limit=${state.itemsPerPage}&page=${state.postPage}`).then(res => {
            if (!res.ok) {
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
        }).catch(err => {
            setState(prevState => {
                return {
                    ...prevState,
                    posts: [],
                    totalPosts: 0,
                    postsLoading: false
                }
            })
            catchError(err)
        })
        window.scrollTo({
            top: 0,
        })
    };

    const catchError = (error) => {
        if (error.message) {
            setState(prevState => {
                const currentError = [{ message: error.message, title: error.title }, ...prevState.error]
                return { ...prevState, error: currentError }
            })

        }
    };

    const errorHandler = () => {
        setState(prevState => {
            return { ...prevState, error: [], loading: false }
        })
    }
    const statusUpdateHandler = () => {
        try {
            if (!state.isAuthenticated) {
                console.log(state.isAuthenticated)
                const error = new Error("Sign in to update and view status")
                error.title = "Unauthorized access"
                throw error
            }
            let url = "https://slampost-8dd6d1d06367.herokuapp.com/feeds/status"
            fetch(url, {
                method: "PATCH",
                body: JSON.stringify({
                    status: state.statusInput
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + state.token,
                    "X-CSRF-Token": state.csrfToken
                },
                // credentials: "include"
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
                    localStorage.setItem("slamUserStatus", resData.status)
                    setState(prevState => {
                        return {
                            ...prevState, userStatus: resData.status, statusInput: ""
                        }
                    })
                }).catch(catchError)

        } catch (err) {
            catchError(err)
        }

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
        setState(prevState => {
            return { ...prevState, editLoading: true, loading: true }
        })
        let url = "https://slampost-8dd6d1d06367.herokuapp.com/feeds/post"
        let method = "post"

        if (state.isEditing) {
            url = `https://slampost-8dd6d1d06367.herokuapp.com/feeds/edit/${state.editPost._id}`;
            method = "PUT"
        }
        const formData = new FormData()
        console.log(postData)
        formData.append("title", postData.title);
        formData.append("content", postData.content);
        formData.append("image", postData.base64Image);
        if (state.isEditing) formData.append("oldimage", postData.oldImageValue)

        fetch(url, {
            method: method,
            body: formData,
            headers: {
                "Authorization": "Bearers " + state.token,
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: "include"
        }).then(res => {
            if (!res.oK) {
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
                    loading: false,
                    isCreateNewPost: false
                }
            })
        }).catch(err => {
            setState({
                isEditing: false,
                loading: false,
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

    const handleFetchUser = () => {
        if (!state.user?._id) {
            return
        }
        fetch(`https://slampost-8dd6d1d06367.herokuapp.com/auth/${state.user?._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: 'include',
        }).then(res => {
            if (!res.ok) {
                return
            }
            return res.json()
        }).then(resData => {
            setState(prevState => {
                return { ...prevState, currentUser: resData }
            })
        }).catch(catchError)
    }
    const createdAt = (dateString) => {
        const nDate = new Date(dateString)
        const month = nDate.getMonth()
        const fullYear = nDate.getFullYear()
        const hour = nDate.getHours()
        const minute = nDate.getMinutes()
        const date = nDate.getDate()
        let timeZone;
        if (hour < 12 && hour) {
            timeZone = "AM"
        } else {
            timeZone = "PM"
        }
        return date + "/" + month + "/" + fullYear + "  " + hour + ":" + minute + " " + timeZone
    }

    const emitContent = (contentLength, content) => {
        let newContent;
        if (state.mobileView && content.length > contentLength) {
            newContent = content.slice(0, contentLength)
            return newContent + "..."
        }
        if (state.miniDesktop && content.length > contentLength + 93) {
            newContent = content.slice(0, contentLength + 93)
            return newContent + "..."
        }
        else if (!state.miniDesktop && !state.mobileView && content.length > contentLength + 240) {
            newContent = content.slice(0, contentLength + 240)
            return newContent + "..."
        }
        return content
    }


    const likePost = async (postId, likeOrDislike) => {

        let postLike;
        if (likeOrDislike === "like") {
            postLike = 1
        }
        if (likeOrDislike === "dislike") {
            postLike = -1;
        }
        try {
            if (!state.isAuthenticated) {
                const error = new Error("Couldn't complete like operation. sign in first.")
                error.title = "Unauthorised access"
                throw error
            }
            const sendLike = await fetch("https://slampost-8dd6d1d06367.herokuapp.com/feeds/likes", {
                method: "put",
                body: JSON.stringify({
                    postId: postId,
                    postLike: `${postLike}`,
                    userId: state.user._id
                }),
                // credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + state.token,
                    "X-CSRF-Token": state.csrfToken
                }
            })
            const response = await sendLike.json()
            if (!response.ok) {
                const error = new Error("Couldn't complete like operation")
                error.title = "Like validation error"
                throw error
            }
        } catch (err) {
            catchError(err)
        }
    }

    const followUser = async (followOrUnfollow, followedUserId) => {

        try {
            if (!state.isAuthenticated) {
                const error = new Error("Couldn't complete follow operation. sign in first.")
                error.title = "Unauthorised access"
                throw error
            }
            if (followedUserId === state.user._id) {
                return
            }
            const sendFollowRequest = await fetch("https://slampost-8dd6d1d06367.herokuapp.com/feeds/follow", {
                method: "put",
                body: JSON.stringify({
                    followedUserId: followedUserId,
                    followOrUnfollow: followOrUnfollow,
                    userId: state.user._id
                }),
                // credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + state.token,
                    "X-CSRF-Token": state.csrfToken
                }
            })
            const response = await sendFollowRequest.json()
            if (!response.ok) {
                const error = new Error("Couldn't complete follow operation")
                error.title = "Processing error"
                throw error
            }
        } catch (err) {
            catchError(err)
        }
    }
    const deletePostHandler = (postId) => {
        setState(prevState => {
            return {
                ...prevState, loading: true
            }
        });
        fetch(`https://slampost-8dd6d1d06367.herokuapp.com/feeds/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearers " + state.token,
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: "include"
        }).then(res => {
            if (!res.ok) {
                throw new Error("Deleting a post failed")
            }
            return res.json()
        }).then(resData => {
            setState(prevState => {
                // let updatedDeletedPosts = prevState.posts.filter(posts => posts._id !== postId)
                return {
                    ...prevState,
                    loading: false
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
    const currentContext = {
        startEditPostHandler,
        cancelEditPostHandler,
        finishedEditHandler,
        deletePostRequest,
        deletePostHandler,
        loadPosts,
        addPost,
        likePost,
        editPost,
        yesButtonFunctions,
        statusInputChangeHandler,
        statusUpdateHandler,
        cancelDeletetPost,
        catchError,
        errorHandler,
        createNewPost,
        handleFetchUser,
        createdAt,
        followUser,
        emitContent,
        state,
        setState
    }

    return (
        <FeedContext.Provider value={currentContext}>
            {children}
        </FeedContext.Provider>
    )

}