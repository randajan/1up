import QRCodeOrigin from "qrcode";

import { Eye } from "./Eye";
import { Bits } from "./Bits";

import { drawQRCanvas } from "../drawing/draw";

const calculateSchema = (contentBody, ecc="M") => {

    const qr = QRCodeOrigin.create(contentBody, { errorCorrectionLevel:ecc });
    const { modules: { size, data: rawData } } = qr;

    const bits = new Bits();
    const eyes = Eye.generateList(size);

    for (const [k, v] of rawData.entries()) {
        if (!v) { continue; }
        const y = Math.floor(k / size);
        const x = k % size;
        if (!Eye.is(size, x, y)) { bits.set(x, y); }
    }


    return { bits, eyes, size, sizeHalf: size / 2 };
}

export class QrGen {
    static create(opt) { return new QrGen(opt); }

    constructor({ canvas, onChange } = {}) {
        const _p = { self: this, canvas };

        _p.onChange = typeof onChange === "function" ? onChange : (() => { });

        this.setConfig = this.setConfig.bind(_p);
        this.setStyle = this.setStyle.bind(_p);
        this.render = this.render.bind(_p);
    }

    setConfig(config = {}) {
        const { self, onChange } = this;
        const { content, ecc, label, size } = config;
        this.content = content;
        this.ecc = ecc;
        this.label = label;
        this.size = size;
        delete this.schema;
        onChange(self);
        return self;
    }

    setStyle(style = {}) {
        const { self, onChange } = this;
        this.style = style;
        onChange(self);
        return self;
    }

    render() {
        const { style, content, ecc } = this;

        if (!content || !style) { return ""; }

        if (!this.schema) { this.schema = calculateSchema(content.body, ecc); }
        if (!this.schema) { return ""; }

        const canvas = drawQRCanvas(this);
        return canvas?.toString() || "";

    }
}
