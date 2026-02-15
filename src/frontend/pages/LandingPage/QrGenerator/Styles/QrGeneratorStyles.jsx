import React from "react";

import "./QrGeneratorStyles.scss";

import { QrGeneratorFieldGroups } from "../Field/QrGeneratorFieldGroups";
import { QrGeneratorSection } from "../Section/QrGeneratorSection";
import { useQrGeneratorStylesModel } from "./useQrGeneratorStylesModel";

export const QrGeneratorStyles = ({ say, qrGen, current, onChange }) => {
    const { formatted, handleFieldChange } = useQrGeneratorStylesModel({ current, qrGen, onChange });

    return (
        <QrGeneratorSection title={say?.sayOr("label.styles", "Style") || "Style"}>
            <QrGeneratorFieldGroups
                groups={formatted?.collector?.groups}
                say={say}
                onFieldChange={handleFieldChange}
                defaultExpandedResolver={(group) => group === "bits" || group === "main"}
            />
        </QrGeneratorSection>
    );
};
