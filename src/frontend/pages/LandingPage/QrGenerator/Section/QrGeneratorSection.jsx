import React from "react";

import "./QrGeneratorSection.css";

export const QrGeneratorSection = ({
    title,
    children
}) => {
    return (
        <section className="QrGenerator__section">
            <div className="QrGenerator__sectionTitle">{title}</div>
            <div className="QrGenerator__sectionBody">
                {children}
            </div>
        </section>
    );
};
