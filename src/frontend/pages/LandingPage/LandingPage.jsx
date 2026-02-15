import React from "react";
import { Block } from "@randajan/jet-react/dom/block";
import { Link } from "@randajan/jet-react/dom/link";

import "./LandingPage.scss";

const _pills = ["SVG/PNG", "BEZ REGISTRACE", "API"];
const _swatches = ["is-dark", "is-green", "is-cyan", "is-blue"];

export const LandingPage = () => {
    return (
        <Block level={0} className="LandingPage">
            <section className="LandingPage__hero">
                <h1>QR kódy a zkracovač, které vypadají dobře.</h1>
                <p>Bez registrace. Export SVG/PNG. Tracking, když chceš.</p>
                <div className="LandingPage__pills">
                    {_pills.map((pill) => (
                        <span key={pill} className="LandingPage__pill">{pill}</span>
                    ))}
                </div>
            </section>

            <section className="LandingPage__grid">
                <article className="LandingPage__card LandingPage__card--qr">
                    <h2>Vytvořit QR</h2>
                    <div className="LandingPage__cardBody">
                        <div className="LandingPage__qrMock" aria-hidden>
                            <div className="LandingPage__qrCanvas" />
                        </div>
                        <div className="LandingPage__cardContent">
                            <p>Styl, logo, barvy...</p>
                            <div className="LandingPage__swatches" aria-hidden>
                                {_swatches.map((cls) => (
                                    <span key={cls} className={`LandingPage__swatch ${cls}`} />
                                ))}
                            </div>
                            <Link to="/qr/edit" className="LandingPage__btn LandingPage__btn--cyan">
                                Otevřít editor
                            </Link>
                        </div>
                    </div>
                </article>

                <article className="LandingPage__card LandingPage__card--short">
                    <h2>Zkrátit URL</h2>
                    <div className="LandingPage__inputs">
                        <div className="LandingPage__input">https://example.com/...</div>
                        <div className="LandingPage__input">1up.cz/xYzAb10</div>
                    </div>
                    <div className="LandingPage__cardFooter">
                        <p>Tracking, kampaně...</p>
                        <Link to="/short" className="LandingPage__btn LandingPage__btn--pink">
                            Zkrátit hned
                        </Link>
                    </div>
                </article>
            </section>
        </Block>
    );
};
