// import db from "../../assets/db/ramdb";
// import { authGroup } from "../init";
// import env from "@randajan/simple-app/env";
// import createQueue from "@randajan/queue";
// import { createBeam } from "@randajan/bifrost/server/beam";
// import { list } from "@randajan/jet-core/eachSync";



// export const shopBeam = createBeam(authGroup, "/shop", {
//     remote: {
//         pull: async (auth, socket, ts) => {
//             const stuffs = await db("shopStuffs");

//             let categoriesCount = 0, stuffsCount = 0;
//             const cats = new Map();

//             await stuffs.rows.map(async stuff => {
//                 if (!await stuff("isActive")) { return; }
//                 const cat = await stuff("category");

//                 if (!cat) { return; }
//                 if (!await cat("isActive") || !await cat("webPath")) { return; }

//                 let catVals = cats.get(cat.key);

//                 if (!catVals) {
//                     catVals = await cat.saved.getVals(col => col.display >= 2);
//                     catVals.shopStuffs = [];
//                     cats.set(cat.key, catVals);
//                 }

//                 const stuffVals = await stuff.saved.getVals(col => col.display >= 2);
//                 catVals.shopStuffs.push(stuffVals);

//                 stuffsCount++;
//             }, {
//                 orderBy:[[r=>r("sizeTag")], [r=>r("priceTag")]]
//             });

//             categoriesCount = cats.size;

//             if (!auth) { return { isAuthorized:false, categoriesCount, stuffsCount }; }

//             const categories = list([...cats.values()], v=>v, { orderBy:[v=>v.name] });
//             return { isAuthorized:true, categoriesCount, stuffsCount, categories };

//         }
//     }
// });

// export const shopBeamReset = createQueue(_ => shopBeam.resetAll(), {
//     softMs: env.drivePullDelay * 2,
//     pass: "last"
// });