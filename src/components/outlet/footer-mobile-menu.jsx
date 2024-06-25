import { Link } from "react-router-dom";
import { FaXTwitter, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa6";

export default function FooterMobileMenu (){
    return <div>
          <div className="footer-main">
                        <div className="each-footer-section footer-about">
                            <h3>About SLaM</h3>
                            <section>
                                <Link to="">About us</Link>
                                <Link to="">Locations</Link>
                                <Link to="">Policies</Link>
                                <Link to="">Partners</Link>
                            </section>
                        </div>
                        <div className="each-footer-section footer-recommendations">
                            <h3>Trending Slams</h3>
                            <section>
                                <Link to="">Isreal Gaza war</Link>
                                <Link to="">UK Immigation rules</Link>
                                <Link to="">Russia hits Ukrain Again</Link>
                                <Link to="">Tips on how to loose weight</Link>
                            </section>
                        </div>
                        <div className="each-footer-section footer-interests">
                            <h3>Interests</h3>
                            <section>
                                <Link to="">Politics</Link>
                                <Link to="">Technology</Link>
                                <Link to="">AI</Link>
                                <Link to="">Scence</Link>
                                <Link to="">Engineering</Link>
                            </section>                    </div>
                        <div className="each-footer-section footer-social">
                            <h3>Follow SLaM on</h3>
                            <div className="social-links">
                                <Link to=""><p><FaXTwitter /></p></Link>
                                <Link to=""><p><FaTiktok /></p></Link>
                                <Link to=""><p><FaInstagram /></p></Link>
                                <Link to=""><p><FaFacebook /></p></Link>
                            </div>
                        </div>

                    </div>
    </div>
}