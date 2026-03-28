import { createBeam } from "@randajan/bifrost/server/beam";
import { userGroup } from "../init";
import db from "../../assets/db/ramdb";
import { getUser } from "../../assets/db/sugars";

const calcLevel = async (user, row)=>{
    if (user && user === await row("owner")) { return [ 1, true ]; }
    if (user && (await row("editors")).includes(user)) { return [ 2, true ]; }
    if (await row("isPublic")) { return [ 2, false ]; }
    if (user && (await row("viewers")).includes(user)) { return [2, false]; }
    return [ 5, false ];
}


export const qrStylesBeam = createBeam(userGroup, "/qr/styles", {
    remote:{
        pull:async userId=>{
            const user = await getUser(userId, false);
            const tbl = await db("qrStyles");

            return tbl.rows.map(async row=>{
                const [ lvl, isEditable ] = await calcLevel(user, row);
                const r = await row.saved.getVals(c => c.display >= 2);
                return { ...r, lvl, isEditable };
            });
        }
    },
    unfold:"list"
});