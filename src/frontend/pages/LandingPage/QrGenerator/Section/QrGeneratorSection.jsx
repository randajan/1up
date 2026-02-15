import React, { useCallback, useState } from "react";

import "./QrGeneratorSection.scss";

export const QrGeneratorSection = ({
    title,
    children,
    defaultCollapsed = false,
    onExpandedChange
}) => {
    const [expanded, setExpanded] = useState(() => !defaultCollapsed);

    const toggle = useCallback(() => {
        setExpanded((prev) => {
            const next = !prev;
            onExpandedChange?.(next);
            return next;
        });
    }, [onExpandedChange]);

    return (
        <section className="QrGenerator__section">
            <button
                type="button"
                className="QrGenerator__sectionTitle"
                onClick={toggle}
                aria-expanded={expanded}
            >
                <span className="QrGenerator__sectionTitleText">{title}</span>
                <span className={`QrGenerator__sectionTitleIcon${expanded ? " is-expanded" : ""}`}>{">"}</span>
            </button>
            {expanded && (
                <div className="QrGenerator__sectionBody">
                    {children}
                </div>
            )}
        </section>
    );
};
