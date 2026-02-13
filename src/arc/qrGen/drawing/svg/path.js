import { solids } from "@randajan/props";
import { tag } from "./dom";
import { numFix, toNum } from "../../tools";


const SWEEP_DIR = { "u": "r", "r": "d", "d": "l", "l": "u" };


export class SvgPath {

    static start(canvas, opt) {
        return new SvgPath(canvas, opt);
    }

    constructor(canvas, {
        startX = 0,
        startY = 0,
        getCornerKey,
        getCornerRadius = v => v,
        getCornerType = v => v,
        getCornerSteps = v => v,
        attrs
    }) {

        solids(this, {
            canvas,
            startX, startY, attrs,
            getCornerKey,
            getCornerRadius, getCornerType, getCornerSteps
        });

        solids(this, {
            _parts: [],
        }, false);

        this.moveTo(0, 0);
    }

    moveTo(x = 0, y = 0) {
        const { _parts, canvas:{ s } } = this;
        _parts.push(`M${s(this.x = this.startX + x)} ${s(this.y = this.startY + y)}`);
        return this;
    }

    lineTo(x = 0, y = 0) {
        const { _parts, canvas:{ s } } = this;
        if (x === 0) { _parts.push(`V${s(this.y = numFix(this.y + y))}`); }
        else if (y === 0) { _parts.push(`H${s(this.x = numFix(this.x + x))}`); }
        else { _parts.push(`L${s(this.x += x)} ${s(this.y = numFix(this.y + y))}`); }
        return this;
    }

    line(dir, v) {
        if (dir === "r") { return this.lineTo(v, 0); }
        if (dir === "d") { return this.lineTo(0, v); }
        if (dir === "l") { return this.lineTo(-v, 0); }
        if (dir === "u") { return this.lineTo(0, -v); }
    }

    _cornerArc(ndir, size, radius) {
        const { _parts, canvas:{ s } } = this;
        const v = size * radius;
        const x = ndir.includes('r') ? v : -v;   // směr X
        const y = ndir.includes('d') ? v : -v;   // směr Y
        const clockwise = SWEEP_DIR[ndir[0]] === ndir[1];
        _parts.push(`A${s(v)} ${s(v)} 0 0 ${clockwise ? 1 : 0} ${s(this.x += x)} ${s(this.y += y)}`);
        return this;
    }

    _cornerStep(ndir, size, radius, steps = 1) {
        const v = size * radius;
        const sv = v / steps;
        for (let ss = 0; ss < steps; ss++) { this.line(ndir[1], sv).line(ndir[0], sv); }
        return this;
    }

    _cornerCut(ndir, size, radius, steps = 1) {
        const v = size * radius;          // „výška“ rohu
        const base = v / steps;              // krok ve 45°
        const dirX = ndir.includes('r') ? 1 : -1;   // směr X
        const dirY = ndir.includes('d') ? 1 : -1;   // směr Y

        /* --- 1) TRIVIÁLNÍ ROGH (steps = 1) -------------------------- */
        if (steps === 1) { return this.lineTo(base * dirX, base * dirY); }

        /* --- 2) OBECNÝ ROH (steps > 1) ------------------------------ */
        const offset = base / 2;
        const swap = ndir[0] === "u" || ndir[0] === "d"; // vertikální směr první = swap os
        let amp = 1;                     // začne na +1
        const dAmp = -2 / (steps - 1);      // a každý krok klesne

        for (let s = 0; s < steps; ++s, amp += dAmp) {
            const dx = base + amp * offset;   //  +offset … −offset
            const dy = base - amp * offset;

            if (swap) { this.lineTo(dy * dirX, dx * dirY); }
            else { this.lineTo(dx * dirX, dy * dirY); }
        }
        return this;
    }

    corner(ndir, size, ...args) {
        const { getCornerKey, getCornerRadius, getCornerType, getCornerSteps } = this;
        const key = getCornerKey ? getCornerKey(ndir, this.x, this.y) : ndir;
        const r = toNum(getCornerRadius(key, ...args), 0, 1) ?? 0;
        const c = size * (1 - r);
        const [d0, d1] = ndir;

        if (r < 1) { this.line(d0, c); }

        if (r > 0) {
            const t = getCornerType(key, ...args) ?? "arc";
            const s = toNum(getCornerSteps(key, ...args), 1, 6) ?? 1;

            if (t === "cut") { this._cornerCut(ndir, size, r, s); }
            else if (t === "step") { this._cornerStep(ndir, size, r, s); }
            else { this._cornerArc(ndir, size, r, s); }
        }

        if (r < 1) { this.line(d1, c); }

        return this;
    }

    r(v = 1) { return this.line("r", v); }
    l(v = 1) { return this.line("l", v); }
    d(v = 1) { return this.line("d", v); }
    u(v = 1) { return this.line("u", v); }

    ul(size, ...args) { return this.corner("ul", size, ...args); }
    ur(size, ...args) { return this.corner("ur", size, ...args); }
    ru(size, ...args) { return this.corner("ru", size, ...args); }
    rd(size, ...args) { return this.corner("rd", size, ...args); }
    dr(size, ...args) { return this.corner("dr", size, ...args); }
    dl(size, ...args) { return this.corner("dl", size, ...args); }
    ld(size, ...args) { return this.corner("ld", size, ...args); }
    lu(size, ...args) { return this.corner("lu", size, ...args); }

    close() {
        this._parts.push("Z");
    }

    clear() {
        this._parts.splice(1, this._parts.length);
    }

    toString() {
        const { attrs, _parts, canvas } = this;
        return tag("path", { ...canvas.sAttrs(attrs), "fill-rule":"evenodd", d: _parts.join(' ') });
    }
}
