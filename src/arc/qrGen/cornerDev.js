import { SVGCanvas } from "./drawing/svg"





export const cornerTest = (radius, type, steps)=>{
    const svg = new SVGCanvas({
        viewWidth:100,
        viewHeight:100,
        width:100,
        height:100,
    });

    const path = svg.path({
        startX:10,
        startY:50,
        extra:{
            fill:"black"
        },
        getCornerRadius:_=>radius,
        getCornerType:_=>type,
        getCornerSteps:_=>steps
    });

    path.ur(40).rd(40).dl(40).lu(40);

    return svg.toString();
}