import { solids } from "@randajan/props";
import { joinCssBlocks, wrapCssSelector } from "./css";
import { tag } from "./dom";
import { SVGGroup } from "./group";

export class SVGCanvas extends SVGGroup {
    constructor({
        id, css, defs,
        scale = 1,
        width = 100,
        height = 100,
        viewWidth,
        viewHeight
    }) {

        super("svg", {}, scale);

        solids(this, {
            id, width, height, viewWidth, viewHeight
        });

        solids(this, {
            _css: [], _defs: []
        });

        this.css(css);
        this.defs(defs);
    }

    background(attrs={}) {
        if (attrs["stroke-width"]) { attrs["stroke-width"] *= 2; }
        this.rect(0, 0, this.viewWidth, this.viewHeight, attrs);
    }

    css(block) {
        if (block) { this._css.push(block); }
    }

    cssWrap(selector, css) {
        this.css(wrapCssSelector(selector, css));
    }

    defs(element) {
        if (element) { this._defs.push(element); }
    }

    collectAttrs() {
        const { s, id, width, height, viewWidth, viewHeight,  } = this;
        return {
            ...super.collectAttrs(),
            id, width, height,
            "xmlns": "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            "viewBox": `0 0 ${s(viewWidth)} ${s(viewHeight)}`,
        }
    }

    collectElements() {
        const {_defs, _css } = this;
        return [
            _defs.length && tag("defs", {}, _defs),
            _css.length && tag("style", {}, `<![CDATA[${joinCssBlocks(_css)}]]>`),
            ...super.collectElements(),
        ]
    }
}
