import {
    Link, Outlet, useLocation,
    // useNavigate,
    useParams
} from "react-router-dom"
import "./user.css"
import { useCallback, useContext, useEffect, useState } from "react"
import { FeedContext } from "../../feedContextProvider/feedContextProvider"
import SideBar from "../../outlet/side-bar"
import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup"
import FeedEdit from "../../feeds/feedEdit/feedEdit"
import Loader from "../../loader/loader"
export default function User() {
    const { cancelEditPostHandler,
        finishedEditHandler,
        yesButtonFunctions,
        statusInputChangeHandler,
        statusUpdateHandler,
        cancelDeletetPost,
        createNewPost,
        state,
        followUser,
        setState,
        catchError
    } = useContext(FeedContext);

    const [currentState, setCurrentState] = useState({
        loading: false, user: null, likes: null,
        followedUserId: null,
        following: null, followers: null, isFollowed: false, isFollowing: false
    })
    const { pathname } = useLocation()
    const { id } = useParams()

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

    const handleFetchThisUser = () => {

        fetch(`https://slampost-8dd6d1d06367.herokuapp.com/auth/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": state.csrfToken
            },
            // credentials: 'include',
        }).then(res => {
            if (!res.ok) {
                const error = new Error("Invalid user details... check if login details are correct");
                error.title = "Authentication error"
                throw error;
            }
            return res.json()
        }).then(resData => {
            setCurrentState(prevState => {
                return {
                    ...prevState,
                    user: resData,
                    likes: resData.likes?.length,
                    followers: resData.followers?.length,
                    following: resData.following?.length,
                }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    slammersPosts: resData.posts,
                    loading: false
                }
            })
        }).catch(catchError)
    }

    useEffect(() => {
        window.scrollTo({
            top: 0
        })
        setCurrentState(prevState => {
            return { ...prevState, loading: true }
        })
        setState(prevState => {
            return { ...prevState, loading: true }
        })

        handleFetchThisUser();

        setCurrentState(prevState => {
            return { ...prevState, loading: false }
        })
    }, [])

    useEffect(() => {
        handleFetchThisUser()
    }, [state, currentState])


    useEffect(() => {
        let usersFollowers = currentState.user?.followers
        if (state.isAuthenticated && usersFollowers) {
            setCurrentState(prevState => {
                return {
                    ...prevState, isFollowing: usersFollowers.find(userId => userId === state.user._id)
                }
            })
        }
    }, [currentState.followers])


    const handleFollowUser = useCallback((followOrUnfollow, currentUserId, followedUserId) => {
        console.log(followedUserId)
        console.log(currentUserId)
        try {
            if (!state.isAuthenticated) {
                const error = new Error("Please sign in to folow user")
                error.title = "Unauthorized access"
                throw error
            }
            followUser(followOrUnfollow, currentUserId, followedUserId)
            if (followOrUnfollow === "follow") {
                setCurrentState(prevState => {
                    return {
                        ...prevState, followers: prevState.followers + 1,
                        isFollowed: true, followedUserId: followedUserId
                    }
                })
                setState(prevState => {
                    return { ...prevState, follow: prevState.follow + 1 }
                })
            }
            if (followOrUnfollow === "unfollow") {
                setCurrentState(prevState => {
                    return { ...prevState, followers: prevState.followers - 1, isFollowed: false }
                })
                setState(prevState => {
                    return { ...prevState, follow: prevState.follow - 1 }
                })
            }
        } catch (err) {
            catchError(err)
        }
    })

    return <div className="displayed-outlet">
        {currentState.loading ? <div style={{ textAlign: "center" }}>
            <p>Loading.... please wait</p>
            <Loader />
        </div> : <>
            <div className="user-profile__sidebar">
                <SideBar props={{
                    isAuthenticated: state.isAuthenticated,
                    isCreateNewPost: state.isCreateNewPost,
                    editLoading: state.editLoading,
                    cancelEditPostHandler: cancelEditPostHandler,
                    finishedEditHandler: finishedEditHandler,
                    createNewPost: createNewPost,
                    statusInput: state.statusInput,
                    statusUpdateHandler: statusUpdateHandler,
                    statusInputChangeHandler: statusInputChangeHandler,
                }} />
            </div>
            <div className="main-outlet">
                {state.isEditing && <FeedEdit props={{
                    isAuthenticated: state.isAuthenticated,
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
                <div className="user-profile">
                    {currentState.user?.status && currentState.user.status.length !== 0 && <div className="current-user-status">
                        <p>User Status: {currentState.user?.status}</p>
                    </div>}

                    <div className="user-profile__top-section">
                        <div className="main-user__top-section">
                            <div className="user-personal__section">
                                <div>
                                    {currentState.user?.photo ? <img src={`${currentState.user.photo}`} className="user-profile__photo" /> : <img src={"/avataricon.png"} className="user-profile__photo avatar" />}
                                </div>

                                <div className="user-personal__details">
                                    {state.isAuthenticated && id === state.user?._id && <h2>{currentState.user?.fullname}</h2>}
                                    <p className={id != state.user?._id ? "bolden" : ""}>@{currentState.user?.username.split()[0].toLowerCase()}</p>
                                </div>
                            </div>
                            {currentState.user?._id !== state.user?._id && <div>
                                {
                                    currentState.isFollowing && state.isAuthenticated ?
                                        <p className="follow__unfollow" onClick={() => handleFollowUser("unfollow", currentState.user?._id)}>Unfollow</p> :
                                        <p className="follow__unfollow" onClick={() => handleFollowUser("follow", currentState.user?._id)}>Follow +</p>
                                }
                            </div>
                            }
                        </div>
                        <div className="user-activities">
                            <p><span>{currentState.user?.followers?.length || 0} </span>Follower{currentState.user?.followers?.length <= 1 ? "" : "s"}</p>
                            <p><span>{currentState.user?.following?.length || 0} </span>Following{currentState.user?.following.length <= 1? "" : "s"}</p>
                            <p><span>{currentState.user?.posts.length || 0} </span>Slam{currentState.user?.posts.length <=1 ? "" : "s"}</p>
                            <p><span>{currentState.user?.likes.length || 0} </span>Like{currentState.user?.likes.length <= 1 ? "" : "s"}</p>
                        </div>
                    </div>
                    <div className="sub-links__user-profile">
                        <Link to="" className={pathname === `/user/${id}` ? "subpaths isUserActive" : "sub-paths"}>Slams</Link>
                        <Link to="favorites" className={pathname === `/user/${id}/favorites` ? "subpaths isUserActive" : "sub-paths"}>Favorites</Link>
                        <Link to="trending" className={pathname === `/user/${id}/trending` ? "subpaths isUserActive" : "sub-paths"}>Trending</Link>
                    </div>
                    <Outlet />
                </div>

            </div>

        </>

        }
    </div>
}