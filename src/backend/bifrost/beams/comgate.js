// import { comgateCreate, comgateMethods } from "../../assets/comgate/api";
// import { bifrost, locGroup } from "../init";
// import { createBeam } from "@randajan/bifrost/server/beam";
// import { formatPay } from "../../assets/paywall/formatPay";


// export const comgateBeam = createBeam(locGroup, "/comgate/methods", {
//     remote: {
//         pull: async (loc, socket) => {
//             const [ language, country, currency ] = loc.split(":");

//             const methods = await comgateMethods({ language, country, currency });

//             return methods?.filter(({ group, id })=>{
//                 return (group === "BANK" || group === "CARD") && ( !id.endsWith("_OTHER") );
//             });

//         }
//     },
//     ttl:60*60*1000 //1 hour
// });

// bifrost.rx("/comgate/create", async (socket, { months, method })=>{
//     try {
//         const pay = await formatPay(socket.session?.userId, months);

//         const { id, user, order, label } = pay;
//         const { priceTotal, currency } = order;
//         const { email, name, country, language, localization } = user;

//         const methods = await comgateBeam.get(localization);
//         if (!methods?.length) { throw new Error(`No methods for ${localization}`);  }

//         const check = methods.find(m=>m.id === method);
//         if (!check) { throw new Error(`Unknown method '${method}' for ${localization}`);  }

//         const payload = {
//             price:priceTotal*100, //comgate format
//             country,
//             lang:language,
//             curr:currency,
//             label,
//             refId:id,
//             method,
//             email:email,
//             fullName:name,
//             category:"OTHER",
//             prepareOnly:1
//         }

//         const redirect = await comgateCreate(payload);

//         return { redirect };

//     } catch(err) {
//         return { error:err.message }
//     }

// })