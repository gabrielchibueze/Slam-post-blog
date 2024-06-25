import ButtonComponent from "../../button/button";
import "./page-not-found.css"
export default function PageNotFound() {
    return <div className="page-not-found">
        <h1>Page not found</h1>
        <h3>
            The page or resource you are looking for does not exist or may have been removed.
        </h3>
        <ButtonComponent props={{
            type: "submit",
            title: `Go to slam feeds`,
            link: "/",
            onClick: null,
            mode: "",
            design: "raised"
        }} />
    </div>
}