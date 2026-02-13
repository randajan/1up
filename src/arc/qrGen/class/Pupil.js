import { Bit } from "./Bit";



export class Pupil extends Bit {

    drawSplit(svgPath) {
        const { x, y } = this;

        for (let py = 0; py < 3; py++) {
            for (let px = 0; px < 3; px++) {
                const sp = svgPath.moveTo(x + px, y + py + .5);
                sp.ur(.5, "Outer").rd(.5, "Outer");
                sp.dl(.5, "Outer").lu(.5, "Outer").close();
            }
        }
    }

    drawMerge(svgPath) {
        const { x, y } = this;

        const sp = svgPath.moveTo(x, y + .5);
        sp.ur(.5, "Outer").r(2).rd(.5, "Outer").d(2);
        sp.dl(.5, "Outer").l(2).lu(.5, "Outer").u(2).close();

        return sp;
    }

    drawSolid(svgPath) {
        const { x, y } = this;

        const sp = svgPath.moveTo(x, y + 1.5);
        sp.ur(1.5, "Outer").rd(1.5, "Outer");
        sp.dl(1.5, "Outer").lu(1.5, "Outer").close();

        return sp;
    }
}