import { Bit } from "./Bit";

export class Bits extends Map {

    static xyKey = (x, y) => `${x}:${y}`;
    static offset(x, y, side) {
        switch (side) {
            case "l": return [x - 1, y];
            case "r": return [x + 1, y];
            case "u": return [x, y - 1];
            case "d": return [x, y + 1];
            case "lu": return [x - 1, y - 1];
            case "ru": return [x + 1, y - 1];
            case "ld": return [x - 1, y + 1];
            case "rd": return [x + 1, y + 1];
        }
        return [x, y];
    }

    set(x, y) { return super.set(Bits.xyKey(x, y), new Bit(x, y)); }
    get(x, y) { return super.get(Bits.xyKey(x, y)); }

    getRelative(x, y, side, mask) {
        const [xx, yy] = Bits.offset(x, y, side);
        if (mask && !mask(xx, yy)) { return; }
        return this.get(xx, yy, side);
    }
}