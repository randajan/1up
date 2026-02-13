import { solids } from "@randajan/props";
import { SvgPath } from "./path";
import { svgText } from "./text";
import { tag } from "./dom";
import { numFix } from "../../tools";

const _rescale = ["x", "y", "width", "height", "stroke-width", "font-size", "dx", "dy"];

export class SVGGroup {
    constructor(tagName= "g", attrs = {}, scale = 1 ) {
        solids(this, { tagName, scale, attrs, _elements: [] });

        this.s = this.s.bind(this);
    }

    s(value) { return numFix(value * this.scale); }

    sAttrs(attrs = {}) {
        const out = { ...attrs };
        for (const key of _rescale) {
            if (out[key] == null) { continue; }
            out[key] = this.s(out[key]);
        }
        return out;
    }

    rect(x, y, width, height, attrs = {}) {
        this._elements.push(tag("rect", this.sAttrs({ ...attrs, x, y, width, height })));
    }

    path(opt = {}) {
        const sp = SvgPath.start(this, opt);
        this._elements.push(sp);
        return sp;
    }

    text(text, attrs = {}) {
        const el = svgText(text, this.sAttrs({ ...attrs }));
        this._elements.push(el);
        return el;
    }

    image(x, y, width, height, attrs = {}) {
        const el = tag("image", this.sAttrs({ ...attrs, x, y, width, height }));
        this._elements.push(el);
        return el;
    }

    use(href, x, y, width, height, attrs = {}) {
        const hrefAttrs = href ? { href, "xlink:href": href } : {};
        const el = tag("use", this.sAttrs({ ...attrs, ...hrefAttrs, x, y, width, height }));
        this._elements.push(el);
        return el;
    }

    group(attrs = {}) {
        const child = new SVGGroup("g", attrs, this.scale);
        this._elements.push(child);
        return child;
    }

    collectElements() {
        return this._elements;
    }

    collectAttrs() {
        return this.attrs;
    }

    toString() {
        return tag(this.tagName, this.sAttrs(this.collectAttrs()), this.collectElements());
    }
}

