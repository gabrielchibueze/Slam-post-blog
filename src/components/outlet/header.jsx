import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "../error/error";
import ButtonComponent from "../button/button";
import { useContext, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { FeedContext } from "../feedContextProvider/feedContextProvider";
import FooterMobileMenu from "./footer-mobile-menu";

export default function Header() {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const {
        state,
        setState
    } = useContext(FeedContext)
    const [headerState, setHeaderState] = useState({
        username: null,
        viewMobileMode: null,
        viewDesktopMode: null,
        viewMenu: false,
    })

    const handleLogut = () => {
        localStorage.removeItem("slamUserToken");
        localStorage.removeItem("slamUserId");
        localStorage.removeItem("slamUsername")
        localStorage.removeItem("slamUserStatus")
        setState(prevState => {
            return {
                ...prevState, user: { _id: null, username: null }, isAuthenticated: false, token: null, userStatus: null, active: false
            }
        })
        setHeaderState(prevState => {
            return {
                ...prevState,
                isAuthenticated: false,
                username: null,
                userIdFromLocalStorage: null
            }
        })
        navigate("/")
    }
    function toggleMenu() {
        setHeaderState(prevState => {
            return { ...prevState, viewMenu: !headerState.viewMenu }
        })
    }

    function closeMenu() {
        setHeaderState(prevState => {
            return { ...prevState, viewMenu: false }
        })
    }

    useEffect(() => {
        if (state.user && state.user.username && state.user._id && state.token) {
            const username = state.user.username.split("")[0].toUpperCase() + state.user.username.slice(1)
            setHeaderState(prevState => {
                return {
                    ...prevState, username: username
                }
            })
        }

        function resizeWindowFunction() {
            if (window.outerWidth <= 400) {
                setState(prevSate => {
                    return { ...prevSate, mobileView: true, miniDesktop: false }
                })
            }
            if (window.outerWidth > 400 && window.outerWidth <= 520) {
                setState(prevSate => {
                    return { ...prevSate, mobileView: false, miniDesktop: true }
                })
            } if (window.outerWidth > 520) {
                setState(prevSate => {
                    return { ...prevSate, mobileView: false, miniDesktop: false }
                })
            }
            if (window.outerWidth <= 799) {
                setHeaderState(prevState => {
                    return { ...prevState, vieMobilewMode: true, viewDesktopMode: false }
                })
            }
            if (window.outerWidth >= 800) {
                setHeaderState(prevState => {
                    return { ...prevState, viewMobileMode: false, viewDesktopMode: true, viewMenu: false }
                })
            }
        }
        window.addEventListener("load", resizeWindowFunction);
        window.addEventListener("resize", resizeWindowFunction);
        return () => window.removeEventListener("resize", resizeWindowFunction)
    }, [state])

    const greetUserSection = <div>
        {
            state.user && state.user._id && state.isAuthenticated ?
                <div className="header__nagivation-link isAut-section mboileViewOfUser">
                    <Link to={`/user/${state.user._id}`} className={pathname.includes("/user") ? "isActive" : ""}>Hello {headerState.username}</Link>
                    <ButtonComponent props={{
                        type: `button`,
                        title: `Logout`,
                        link: null,
                        onClick: handleLogut,
                        mode: "danger",
                        design: "magnified"
                    }} />
                </div> :
                <div className="signup__and__login">
                    <Link to="/login">
                        <ButtonComponent props={{
                            type: `button`,
                            title: `Login`,
                            link: null,
                            onClick: null,
                            mode: "success",
                            design: "graceful"
                        }} />
                    </Link>
                    {!state.isAuthenticated && <Link to="/signup">
                        <ButtonComponent props={{
                            type: `button`,
                            title: `Sign up`,
                            link: null,
                            onClick: null,
                            mode: "success",
                            design: "magnified"
                        }} />
                    </Link>}
                </div>
        }
    </div>
    return (
        <ErrorBoundary>
            <header>
                <Link to="/" onClick={closeMenu}><h1>S L a M</h1></Link>
                {headerState.viewDesktopMode ?
                    <div className="header__nagivation-link desktop-view__mode">
                        <Link to="/recent-feeds" className={pathname === "/recent-feeds" ? "isActive" : ""}>Recent feed</Link>
                        <Link to="/" className={pathname === "/" ? "isActive" : ""}>Feeds</Link>
                        {greetUserSection}
                    </div> :
                    <div onClick={toggleMenu} className="toggle-icon">
                        {
                            headerState.viewMenu ? <h1 style={{ color: "whitesmoke" }}><MdOutlineCloseFullscreen /></h1> : <h1 style={{ color: "whitesmoke" }}><IoMenu /></h1>
                        }
                    </div>
                }
                {
                    headerState.viewMenu &&
                    <div className="mobile-view__mode" onClick={toggleMenu}>
                        <Link to="/recent-feeds" className={pathname === "/recent-feeds" ? "isActive" : ""}>Recent feed</Link>
                        <Link to="/" className={pathname === "/" ? "isActive" : ""}>Feeds</Link>
                        {greetUserSection}
                        <div className="mobile-view__links">
                            <FooterMobileMenu />
                        </div>
                    </div>
                }
            </header>
        </ErrorBoundary >
    )
}