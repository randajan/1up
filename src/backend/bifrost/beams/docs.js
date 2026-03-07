// import { createQueue } from "@randajan/queue";
// import { bifrost } from "../init";
// import { createBeam } from "@randajan/bifrost/server/beam";

// import db from "../../assets/db/ramdb";

// export const docsBeam = createBeam(bifrost, "/docs", {
//     remote:{
//         pull:async _=>{
//             const tbl = await db("webDocs");
//             return tbl.rows.map(async doc=>{
//                 return doc.saved.getVals(c=>c.display>=2);
//             });
//         }
//     }
// });



// export const docsBeamReset = createQueue(_=>docsBeam.resetAll(), {
//     softMs:1000,
//     pass:"last"
// });