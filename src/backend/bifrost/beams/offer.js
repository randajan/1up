// import { createQueue } from "@randajan/queue";
// import { bifrost } from "../init";
// import { getPrices } from "../../assets/db/sugars";
// import { createBeam } from "@randajan/bifrost/server/beam";



// export const offerBeam = createBeam(bifrost, "/offer", {
//     remote:{
//         pull:async _=>{
//             const price = await getPrices();
//             return price?.saved.getVals(col => col.display >= 2);
//         }
//     }
// });