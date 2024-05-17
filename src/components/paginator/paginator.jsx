/* eslint-disable react/prop-types */

import "./paginator.css"
export default function Paginator({ props, children }) {

    return <div>
        <div className="all-slam-posts">
            {children}
        </div>
        <div className="pagination">
            {
                (props.postPage > 1) &&

                <div className="paginator-btn prev" onClick={props.onPreviousPage}>
                    <p>{"<<"} Prev</p>
                </div>
            }
            {(props.totalPosts / props.postPage) > props.itemsPerPage &&
                <div className="paginator-btn next" onClick={props.onNextPage}>
                    <p>Next {">>"}</p>
                </div>
            }

        </div>
    </div>
}