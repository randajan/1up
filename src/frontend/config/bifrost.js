import { socket } from "@randajan/simple-app/fe";
import { BifrostRouter } from "@randajan/bifrost/client";

export const bifrost = new BifrostRouter(socket);


//export const roomBeam = bifrost.createBeam("/room");
// export const shopBeam = bifrost.createBeam("/shop");
// export const varsBeam = bifrost.createBeam("/vars");



//window.bifrost = bifrost;