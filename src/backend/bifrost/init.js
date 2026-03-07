import { BifrostRouter } from "@randajan/bifrost/server";
import { io } from "@randajan/simple-app/be/koa";
import { solids } from "@randajan/props";
import { getUser } from "../assets/db/sugars";
import { sessionBridge } from "../init";


export const bifrost = new BifrostRouter(io);

bifrost.on("hi", socket=>{

    solids(socket, {
        getUserId:async _=>socket.withSession(ctx=>ctx.session.userId, undefined),
        getUser:missingError=>socket.getUserId().then(userId=>getUser(userId, missingError))
    });

});

export const clientGroup = bifrost.createGroup(socket=>socket.clientId);
export const userGroup = bifrost.createGroup(socket=>socket.getUserId());
// export const locGroup = bifrost.createGroup(socket=>socket.loc);



sessionBridge.on("sessionSet", ({ clientId, sessionId })=>{
    const sockets = clientGroup.get(clientId);
    userGroup.resetSockets(sockets);
});