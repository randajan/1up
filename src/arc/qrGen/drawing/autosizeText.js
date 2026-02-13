

const measureLine = (ctx, line)=>{
    const m = ctx.measureText(line);
    const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    return { width:m.width, height };
}

export const measureText = (canvas, text, fontSize = 16) => {
    if (!canvas?.getContext) { return; }
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}`;
    
    return measureLine(ctx, text);
};

export const autosizeText = (canvas, text, maxWidth, maxHeight, scale=1) => {
    const _fontSize = 10;

    const r = measureText(canvas, text, _fontSize);

    if (!r) { return; }
    
    const [fs, sc] = [(maxWidth / r.width), (maxHeight / r.height)].sort((a,b)=>a-b);

    const sclr = fs / sc;
    r.width *= sclr * scale;
    r.height *= sclr * scale;

    r.fontSize = fs * _fontSize * scale;

    return r;
}