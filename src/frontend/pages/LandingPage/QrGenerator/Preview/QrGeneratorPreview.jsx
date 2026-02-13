import React, { useCallback } from "react";
import { Button } from "@mui/material";

import "./QrGeneratorPreview.css";

const resolveSvgSource = (previewRef, qrGen) => {
    let source = qrGen?.render();
    if (!source) {
        const root = previewRef?.current;
        const svg = root?.querySelector?.("svg");
        if (!svg) { return ""; }
        source = svg.outerHTML;
    }
    if (!source) { return ""; }
    if (!source.startsWith("<?xml")) {
        source = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n${source}`;
    }
    return source;
};

const resolveSvgSize = (svgText) => {
    try {
        const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg) { return { width: 512, height: 512 }; }
        const widthAttr = svg.getAttribute("width");
        const heightAttr = svg.getAttribute("height");
        const viewBox = svg.getAttribute("viewBox");

        const parseSize = (val) => {
            if (!val) { return null; }
            const num = Number(String(val).replace(/[^0-9.]/g, ""));
            return Number.isFinite(num) && num > 0 ? num : null;
        };

        const width = parseSize(widthAttr);
        const height = parseSize(heightAttr);
        if (width && height) { return { width, height }; }

        if (viewBox) {
            const parts = viewBox.split(/[\s,]+/).map(Number);
            if (parts.length === 4 && parts.every(n => Number.isFinite(n))) {
                return { width: parts[2], height: parts[3] };
            }
        }
    } catch {}
    return { width: 512, height: 512 };
};

export const QrGeneratorPreview = ({ say, previewRef, qrGen }) => {
    const handleDownloadSvg = useCallback(() => {
        let source = resolveSvgSource(previewRef, qrGen);
        if (!source) { return; }
        const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "qr.svg";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    }, [previewRef, qrGen]);

    const handleDownloadPng = useCallback(() => {
        const source = resolveSvgSource(previewRef, qrGen);
        if (!source) { return; }
        const { width, height } = resolveSvgSize(source);

        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (!blob) {
                    URL.revokeObjectURL(url);
                    return;
                }
                const pngUrl = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = pngUrl;
                anchor.download = "qr.png";
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(pngUrl);
                URL.revokeObjectURL(url);
            }, "image/png");
        };
        img.onerror = () => URL.revokeObjectURL(url);
        img.src = url;
    }, [previewRef, qrGen]);

    return (
        <div className="QrGenerator__panel QrGenerator__panel--preview">
            <div className="QrGenerator__preview">
                <div className="QrGenerator__previewTitle">{say?.sayOr("label.preview", "Preview") || "Preview"}</div>
                <div className="QrGenerator__previewFrame" ref={previewRef} />
                <div className="QrGenerator__previewActions">
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleDownloadSvg}
                    >
                        {say?.sayOr("label.downloadSvg", "Download SVG") || "Download SVG"}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleDownloadPng}
                    >
                        {say?.sayOr("label.downloadPng", "Download PNG") || "Download PNG"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
