import React from "react";
import { Link } from "@randajan/jet-react/dom/link";

import "./HeadPane.scss";
import { useBeam } from "@randajan/bifrost/client/react";
import { userBeam } from "../../config/bifrost";

export const HeadPane = () => {
    const { data:profile } = useBeam(userBeam);


    return (
        <header className="HeadPane">
            <section className="HeadPane__inner">
                <Link to="/" className="HeadPane__brand" aria-label="1UP">
                    <img src="/logo.svg" alt="1UP" />
                </Link>
                <nav className="HeadPane__nav" aria-label="Main">
                    <Link to="/qr/edit">QR</Link>
                    {profile?.name}
                    {/* <Link to="/short">Zkracovač</Link>
                    <Link to="/templates">Šablony</Link>
                    <Link to="/pricing">Ceník</Link> */}
                </nav>
                <div className="HeadPane__actions">
                    <Link to="/login" className="HeadPane__login">Přihlásit se</Link>
                    <Link to="/qr/edit" className="HeadPane__cta">Začít zdarma</Link>
                </div>
            </section>
        </header>
    );
};
