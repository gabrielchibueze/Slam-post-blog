/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ErrorBoundary from "../error/error";
import ButtonComponent from "../button/button";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdOutlineCloseFullscreen } from "react-icons/md";

export default function Header({ props }) {
    const [state, setState] = useState({
        user: null,
        isAuthenticated: false,
        username: null,
        viewMode: null,
        viewMenu: false,
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


    function toggleMenu() {
        setState(prevState => {
            return { ...prevState, viewMenu: !state.viewMenu }
        })
    }
    console.log(state.viewMenu)
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

        function resizeWindowFunction() {
            if (window.innerWidth <= 600) {
                setState(prevState => {
                    return { ...prevState, viewMode: "mobile" }
                })
            }

            if (window.innerWidth > 600 && window.innerWidth <= 1100) {
                setState(prevState => {
                    return { ...prevState, viewMode: "miniDesktop" }
                })
            }
            else if (window.innerWidth > 1100) {
                setState(prevState => {
                    return { ...prevState, viewMode: "desktop" }
                })
            }
        }
        window.addEventListener("resize", resizeWindowFunction);
        return () => window.removeEventListener("resize", resizeWindowFunction)

    }, [props])

    return (
        <header>
            <Link to="/"><h1>SLaM</h1></Link>
            {state.viewMode === "desktop" ?
                <div className="header__nagivation-link desktop-view__mode">
                    <ErrorBoundary>
                        <Link to="/recent-feeds">Recent feed</Link>
                        <Link to="/">Feeds</Link>
                        {
                            state.user && state.user._id === state.userIdFromLocalStorage && state.isAuthenticated ?
                                <div className="isAut-section">
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
                </div> :
                <div onClick={toggleMenu} className="toggle-icon">
                    {
                        state.viewMenu ? <h1><MdOutlineCloseFullscreen /></h1> : <h1><IoMenu /></h1>
                    }
                </div>
            }
            {
              state.viewMode !== "desktop" && state.viewMenu && <div className="mobile-view__mode" onClick={toggleMenu}>
                    <Link to="/recent-feeds">Recent feed</Link>
                    <Link to="/">Feeds</Link>
                    {
                        state.user && state.user._id === state.userIdFromLocalStorage && state.isAuthenticated ?
                            <div className="header__nagivation-link isAut-section mboileViewOfUser">
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
                </div>
            }
        </header>
    )
}
