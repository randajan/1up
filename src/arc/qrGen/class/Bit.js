
export class Bit {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(mode, svgPath, getRelative, markAsDrawed) {
        if (mode === "split") { return this.drawSplit(svgPath); }
        if (mode === "solid") { return this.drawSolid(svgPath, getRelative, markAsDrawed); }
        return this.drawMerge(svgPath, getRelative, markAsDrawed);
    }

    drawSplit(svgPath) {
        const sp = svgPath.moveTo(this.x, this.y + .5);
        return sp.ur(.5, "Outer").rd(.5, "Outer").dl(.5, "Outer").lu(.5, "Outer").close();
    }

    drawSolid(svgPath, getRelative, markAsDrawed) {
        return this.drawMerge(svgPath, getRelative, markAsDrawed);
    }

    drawMerge(svgPath, getRelative, markAsDrawed) {
        const f = getRelative;
        let b = this;
        let w = "u";
        let c = 0;

        const sp = svgPath.moveTo(b.x, b.y + .5);

        while (b) {
            if (c > 0 && w === "u" && b === this) { break; }

            let l, r, u, d, lu, ld, ru, rd;
            c++;

            if (w === "u") {
                markAsDrawed(b);
                if (lu = f(b, "lu")) { sp.ul(.5, "Inner"); b = lu; w = "l"; continue; } //turn and go left-up
                else if (u = f(b, "u")) { sp.u(1); b = u; continue; } // continue up
                else { sp.ur(.5, "Outer"); w = "r"; } // turn right
            }

            if (w === "r") {
                if (ru = f(b, "ru")) { sp.ru(.5, "Inner"); b = ru; w = "u"; continue; } //turn and go right-up
                else if (r = f(b, "r")) { sp.r(1); b = r; continue; } //continue right
                else { sp.rd(.5, "Outer"); w = "d"; } //turn down
            }

            if (w === "d") {
                if (rd = f(b, "rd")) { sp.dr(.5, "Inner"); b = rd; w = "r"; continue; } //turn and go right-down
                else if (d = f(b, "d")) { sp.d(1); b = d; continue; } // continue down
                else { sp.dl(.5, "Outer"); w = "l"; } //turn left
            }

            if (w === "l") {
                if (ld = f(b, "ld")) { sp.ld(.5, "Inner"); b = ld; w = "d"; continue; } //turn and go left-down
                else if (l = f(b, "l")) { sp.l(1); b = l; w = "l"; continue; } //continue left
                else { sp.lu(.5, "Outer"); w = "u"; } //turn up
            }

        }

        return svgPath.close();
    }
}