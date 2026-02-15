import React from "react";

import "./QrGeneratorContent.scss";
import { QrGeneratorFieldGroups } from "../Field/QrGeneratorFieldGroups";
import { QrGeneratorSection } from "../Section/QrGeneratorSection";
import { useQrGeneratorContentModel } from "./useQrGeneratorContentModel";

export const QrGeneratorContent = ({ say, qrGen, current, onChange }) => {
    const { formatted, handleFieldChange } = useQrGeneratorContentModel({ current, qrGen, onChange });

    return (
        <QrGeneratorSection title={say?.sayOr("label.input", "Content") || "Content"}>
            <QrGeneratorFieldGroups
                groups={formatted?.collector?.groups}
                say={say}
                onFieldChange={handleFieldChange}
                className="QrGenerator__groups--content"
            />
        </QrGeneratorSection>
    );
};
