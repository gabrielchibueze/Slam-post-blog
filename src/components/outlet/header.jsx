/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ErrorBoundary from "../error/error";
import ButtonComponent from "../button/button";
import { useEffect, useState } from "react";

export default function Header({ props }) {
    const [state, setState] = useState({
        user: null,
        isAuthenticated: false,
        username: null,
        userIdFromLocalStorage: null
    })

    const handleLogut = () => {
        localStorage.removeItem("slamUserToken");
        localStorage.removeItem("slamUserId");
        localStorage.removeItem("slamUsername")
        setState(prevState => {
            return {
                ...prevState, user: null, username: null
            }
        })
    }

    useEffect(() => {
        const userIdFromLocalStorage = localStorage.getItem("slamUserId")
        const usernameFromLocalStorage = localStorage.getItem("slamUsername")
        if (userIdFromLocalStorage === props.user?._id) {
            const username = usernameFromLocalStorage.split("")[0].toUpperCase() + usernameFromLocalStorage.slice(1)
            setState(prevState => {
                return {
                    ...prevState, isAuthenticated: props.isAuthenticated, user: props.user, username: username, userIdFromLocalStorage: userIdFromLocalStorage
                }
            })
        }
    }, [props])
    return (
        <header>
            <Link to="/"><h1>SLaM</h1></Link>
            <div className="header__nagivation-link">
                <ErrorBoundary>
                    <Link to="/recent-feeds">Recent feed</Link>
                    <Link to="/">Feeds</Link>
                    {
                        state.user && state.user._id === state.userIdFromLocalStorage && state.isAuthenticated ?
                            <div className="header__nagivation-link isAut-section">
                            <Link>Hello {state.username}</Link>
                                <ButtonComponent props={{
                                    type: `button`,
                                    title: `Logout`,
                                    link: null,
                                    onClick: handleLogut,
                                    mode: "accent",
                                    design: "danger"
                                }} />
                            </div> :
                            <Link to="/login">Login</Link>
                    }
                </ErrorBoundary>
            </div>
        </header>
    )
}
