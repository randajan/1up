import { Bit } from "./Bit";
import { Pupil } from "./Pupil";


export class Eye extends Bit {

    static is(size, x, y) {
        if (y > 6 && x > 6) { return; }
        const m = size - 7;
        if (x > 6 && x < m) { return; }
        if (y > 6 && y < m) { return; }
        return true;
    }

    static generateList(size) {
        return [ new Eye(0, 0), new Eye(0, size - 7), new Eye(size - 7, 0) ]
    }

    constructor(x, y) {
        super(x, y);
        this.pupil = new Pupil(x+2, y+2);
    }

    drawSplit(svgPath) {
        const { x, y } = this;

        for (let py = 0; py < 7; py++) {
            for (let px = 0; px < 7; px++) {
                if (py !== 0 && py !== 6 && px !== 0 && px !== 6) { continue; }
                const sp = svgPath.moveTo(x + px, y + py + .5);
                sp.ur(.5, "Outer").rd(.5, "Outer");
                sp.dl(.5, "Outer").lu(.5, "Outer").close();
            }
        }
    }

    drawMerge(svgPath) {
        const { x, y } = this;

        const sp = svgPath.moveTo(x, y + .5);
        sp.ur(.5, "Outer").r(6).rd(.5, "Outer").d(6);
        sp.dl(.5, "Outer").l(6).lu(.5, "Outer").u(6).close();

        sp.moveTo(x + 1, y + 1 + .5);
        sp.ur(.5, "Inner").r(4).rd(.5, "Inner").d(4);
        sp.dl(.5, "Inner").l(4).lu(.5, "Inner").u(4).close();

        return sp;
    }

    drawSolid(svgPath) {
        const { x, y } = this;

        const sp = svgPath.moveTo(x, y + 3.5);
        sp.ur(3.5, "Outer").rd(3.5, "Outer");
        sp.dl(3.5, "Outer").lu(3.5, "Outer").close();

        sp.moveTo(x + 1, y + 1 + 2.5);
        sp.ur(2.5, "Inner").rd(2.5, "Inner");
        sp.dl(2.5, "Inner").lu(2.5, "Inner").close();

        return sp;
    }
}
