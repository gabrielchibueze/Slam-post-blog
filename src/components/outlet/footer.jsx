import { Link } from "react-router-dom";
import ErrorBoundary from "../error/error";

export default function Footer() {
    return (
        <ErrorBoundary>
            <footer>
                <div className="footer-section__about">
                    <h3>About SLaM</h3>
                    <section>
                        <Link to="">About us</Link>
                        <Link to="">Locations</Link>
                        <Link to="">Policies</Link>
                        <Link to="">Partners</Link>
                    </section>
                </div>
                <div className="footer-section__recommendations">
                    <h3>Recommendations</h3>
                    <section>
                        <Link to="">Isreal Gaza war</Link>
                        <Link to="">UK Immigation rules</Link>
                        <Link to="">Russia hits Ukrain Again</Link>
                        <Link to="">Tips on how to loose weight</Link>
                    </section>
                </div>
                <div className="footer-section__interests">
                    <h3>Interests</h3>
                    <section>
                        <Link to="">Politics</Link>
                        <Link to="">Technology</Link>
                        <Link to="">AI</Link>
                        <Link to="">Scence</Link>
                        <Link to="">Engineering</Link>
                    </section>
                </div>
                <div className="footer-section__social">
                    <h3>Follow SLaM on</h3>
                    <section>
                        <Link to="">X</Link>
                        <Link to="">TikTok</Link>
                        <Link to="">Instagram</Link>
                        <Link to="">Facebook</Link>
                    </section>
                </div>

            </footer>
        </ErrorBoundary>
    )

}