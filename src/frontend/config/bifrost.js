
import { socket } from "@randajan/simple-app/fe";
import { BifrostRouter } from "@randajan/bifrost/client";
import { createBeam } from "@randajan/bifrost/client/beam";
import { useBeam } from "@randajan/bifrost/client/react";
import { createQueue } from '@randajan/queue';


export const bifrost = new BifrostRouter(socket);


export const userBeam = createBeam(bifrost, "/user", {
    unfold:"profile",
});



window.userBeam = userBeam;
window.userLogout = async ()=>{
    return await bifrost.tx("/user/logout");
}