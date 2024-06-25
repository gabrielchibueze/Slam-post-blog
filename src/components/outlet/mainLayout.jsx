/* eslint-disable react-hooks/rules-of-hooks */
import Footer from "./footer";
import Header from "./header";
import { Outlet } from "react-router-dom";
import "./mainLayout.css"
export default function mainLayout(props) {

    return (
        <div className="main-layout-outlet">
            <Header props={{user: props.user, isAuthenticated: props.isAuthenticated}} />
            <div className="content-outlet">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

