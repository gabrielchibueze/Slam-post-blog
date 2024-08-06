import AllFeedsPage from "../all-feed.jsx/all-feed";

export default function RecentFeeds (){
    return <AllFeedsPage pageTitle="Recent feeds"/>
}
// /* eslint-disable react/prop-types */
// import { Fragment, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client"
// import FeedTemplate from "../feed-template/feed-template";
// import Paginator from "../../paginator/paginator";
// import Loader from "../../loader/loader";
// import SideBar from "../../outlet/side-bar";
// import FeedEdit from "../feedEdit/feedEdit";
// import ErrorCanfirmPopup from "../../errorCanfirmPopup/errorCanfirmPopup";
// import ErrorBoundary from "../../error/error";
// import { FeedContext } from "../../feedContextProvider/feedContextProvider";
// import "../all-feed/all-feed.css"
// const socket = io("https://slampost-8dd6d1d06367.herokuapp.com");


// const RecentFeeds = () => {
//     const { startEditPostHandler,
//         cancelEditPostHandler,
//         finishedEditHandler,
//         deletePostRequest,
//         deletePostHandler,
//         loadPosts,
//         addPost,
//         editPost,
//         yesButtonFunctions,
//         statusInputChangeHandler,
//         statusUpdateHandler,
//         cancelDeletetPost,
//         catchError,
//         errorHandler,
//         createNewPost,
//         state,
//         setState
//     } = useContext(FeedContext)

//     useEffect(() => {
//         loadPosts()
//     }, [state.postPage])

//     useEffect(() => {
//         socket.on("posts", data => {
//             if (data.action === "create") {
//                 addPost(data.post)
//             }
//             else if (data.action === "update") {
//                 editPost(data.post)
//             } else if (data.action === "delete") {
//                 loadPosts()
//             }
//         })
//         return () => {
//             socket.off()
//         }
//     }, [])

//     return (
//         <Fragment>
//             <ErrorBoundary>
//                 <div className="displayed-outlet">
//                     <SideBar props={{
//                         isAuthenticated: state.isAuthenticated,
//                         isCreateNewPost: state.isCreateNewPost,
//                         editLoading: state.editLoading,
//                         cancelEditPostHandler: cancelEditPostHandler,
//                         finishedEditHandler: finishedEditHandler,
//                         createNewPost: createNewPost,
//                         statusInput: state.statusInput,
//                         statusUpdateHandler: statusUpdateHandler,
//                         statusInputChangeHandler: statusInputChangeHandler,
//                     }} />
//                     <div className="main-outlet">
//                         {state.isEditing && <FeedEdit props={{
//                             isAuthenticated: state.isAuthenticated,
//                             selectedPost: state.editPost,
//                             isEditing: state.isEditing,
//                             editLoading: state.editLoading,
//                             cancelEditPostHandler: cancelEditPostHandler,
//                             finishedEditHandler: finishedEditHandler
//                         }}
//                         />}
//                         {state.deletePostRequest &&
//                             <ErrorCanfirmPopup
//                                 props={{
//                                     title: "Comfirm delete",
//                                     message: "Are you sure you want to delete this post?",
//                                     buttonOneType: "button",
//                                     buttonOneTitle: "Yes",
//                                     buttonOneFunction: yesButtonFunctions,
//                                     buttonTwoType: "reset",
//                                     buttonTwoTitle: "No",
//                                     buttonTwoFunction: cancelDeletetPost

//                                 }} />
//                         }

//                         <section className="">
//                             <h1 style={{ marginTop: "1rem", marginBottom: "2rem" }}>Recent Feeds</h1>
//                             {state.postsLoading ?
//                                 <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                     <Loader />
//                                 </div> :
//                                 <div>
//                                     {
//                                         state.posts && state.posts.length === 0 ?
//                                             <h3 style={{ textAlign: "center", marginTop: "20%" }}>No posts found</h3> :

//                                             <Paginator props={{
//                                                 itemsPerPage: state.itemsPerPage,
//                                                 totalPosts: state.totalPosts,
//                                                 postPage: state.postPage,
//                                                 onPreviousPage: () => loadPosts("previous"),
//                                                 onNextPage: () => loadPosts("next"),
//                                             }}>
//                                                 <div>
//                                                     <main className="all-slam-posts" key="1">
//                                                         {state.posts && state.posts.map((post) => {
//                                                             return (
//                                                                 <div key={post._id}>
//                                                                     <FeedTemplate props={{
//                                                                         postId: post._id,
//                                                                         title: post.title,
//                                                                         image: post.imageUrl,
//                                                                         content: post.content,
//                                                                         createdAt: new Date(post.createdAt).toLocaleDateString() + " " + new Date(post.createdAt).toLocaleTimeString("en-US"),
//                                                                         creator: post.creator?.username,
//                                                                         userId: state.user?._id || null,
//                                                                         postUserId: post.creator?._id || null,
//                                                                         isAuthenticated: state.isAuthenticated,
//                                                                         deletePostHandler: () => deletePostRequest(post._id),
//                                                                         startEditPostHandler: () => startEditPostHandler(post._id)
//                                                                     }} />
//                                                                 </div>
//                                                             )
//                                                         })}
//                                                     </main>
//                                                 </div>
//                                             </Paginator>
//                                     }
//                                 </div>
//                             }

//                         </section>

//                     </div>
//                 </div >

//             </ErrorBoundary>
//         </Fragment >
//     )
// }

// export default RecentFeeds