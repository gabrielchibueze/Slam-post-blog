import { useContext } from "react";
import FeedTemplate from "../../feeds/feed-template/feed-template";
import { FeedContext } from "../../feedContextProvider/feedContextProvider";
import Loader from "../../loader/loader";

export default function UserSlams() {
    const { state, deletePostRequest, startEditPostHandler, createdAt } = useContext(FeedContext)

    const userSlams =
        <main className="all-slam-posts" key="1">
            {
                state.slammersPosts && state.slammersPosts?.length > 0 ?
                    <div>
                        {
                            state.slammersPosts.map((post) => {
                                return (
                                    <div key={post._id} style={{ marginBottom: "1rem" }}>
                                        <FeedTemplate props={{
                                            postId: post._id,
                                            title: post.title,
                                            image: post.imageUrl,
                                            content: post.content,
                                            likes: post.likes?.length || 0,
                                            createdAt: createdAt(post.createdAt),
                                            creator: post.creator?.username,
                                            creatorId: post.creator?._id,
                                            userId: state.user?._id || null,
                                            postUserId: post.creator?._id || null,
                                            isAuthenticated: state.isAuthenticated,
                                            deletePostHandler: () => deletePostRequest(post._id),
                                            startEditPostHandler: () => startEditPostHandler(post._id)
                                        }} />
                                    </div>
                                )
                            })
                        }
                    </div> : <p>No user Slams</p>
            }
        </main>



    return <div>
        {state.loading ?
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader />
            </div> :
            <div>
                {userSlams}
            </div>
        }
    </div>
}