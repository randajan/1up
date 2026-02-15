import React from "react";

import "./Background.scss";

const _stars = Array.from({ length: 14 }, (_, index) => index + 1);

const createBirds = (count = 1) => {
    const birds = [];
    for (let i = 0; i < count; i++) {
        birds.push({
            id: i + 1,
            top: 14 + Math.random() * 66,
            scale: (1 + Math.random() * 0.4).toFixed(2),
            duration: (20 + Math.random() * 10).toFixed(2),
            delay: (-Math.random() * 96).toFixed(2),
            opacity: (0.1 + Math.random() * 0.26).toFixed(2),
            wobble: (3 + Math.random() * 7).toFixed(2),
            reverse: Math.random() > 0.5,
            variant: Math.random() > 0.5 ? "up" : "down",
            flapDuration: (1 + Math.random() * 0.4).toFixed(2),
            flapDelay: (-Math.random() * 2.2).toFixed(2)
        });
    }
    return birds;
};

const _birds = createBirds(3);

export const Background = () => (
    <section className="Background" aria-hidden>
        <div className="Background__nebula" />
        <div className="Background__noise" />
        <div className="Background__scanlines" />
        <div className="Background__birds">
            {_birds.map((bird) => (
                <span
                    key={bird.id}
                    className={`Background__bird${bird.reverse ? " is-reverse" : ""}`}
                    style={{
                        "--bird-top": `${bird.top}%`,
                        "--bird-scale": bird.scale,
                        "--bird-duration": `${bird.duration}s`,
                        "--bird-delay": `${bird.delay}s`,
                        "--bird-opacity": bird.opacity,
                        "--bird-wobble": `${bird.wobble}px`,
                        "--bird-flap-duration": `${bird.flapDuration}s`,
                        "--bird-flap-delay": `${bird.flapDelay}s`
                    }}
                >
                    <span className={`Background__birdSprite is-${bird.variant}`} />
                </span>
            ))}
        </div>
        <div className="Background__stars">
            {_stars.map((id) => (
                <span key={id} className={`Background__star Background__star--${id}`} />
            ))}
        </div>
    </section>
);

export default Background;
