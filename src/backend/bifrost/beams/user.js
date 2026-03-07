import jet from "@randajan/jet-core";
import { getUser } from "../../assets/db/sugars";
// import { notifyUser } from "../../assets/mailing";
import { createBeam } from "@randajan/bifrost/server/beam";
// import { Loc } from "../../../arc/localization";

import { clientGroup, userGroup } from "../init";

const pullUser = async (user) => {
    if (!user) { return }
    const profile = await user.saved.getVals(c => c.display >= 2)
    return profile;
}

const formatProfile = (data)=>{
    const exp = {};
    exp.name = String.jet.to(data.name).substr(0, 64);
    exp.email = String.jet.to(data.email).substr(0, 64);
    // exp.language = Loc.selectLanguage(data.language);
    // exp.country = Loc.selectCountry(data.country);
    // exp.currency = Loc.selectCurrency(data.currency);
    // exp.consentNotify = Boolean.jet.to(data.consentNotify);
    return exp;
}


export const userBeam = createBeam(userGroup, "/user", {
    readonly: false,
    remote: {
        preserveAction:false,
        pull: async (userId, socket) =>pullUser(await getUser(userId, false)),
        push: async (data, userId, socket) => {
            const user = await getUser(userId, false);
            if (!user) { return { isOk:false }; }

            const isOk = await user.update(data);
            const profile = await pullUser(user);
            
            // if (!profile.notifiedWelcome) {
            //     await notifyUser.welcome(user);
            //     await user.update({notifiedWelcome:true});
            //     profile.notifiedWelcome = true;
            // }

            return { isOk, profile }
        }
    },
    actions:{
        //consent:(data)=>({...formatProfile(data), consentGdpr:new Date(), consentTerms:new Date()}),
        update:formatProfile
    },
    unfold:"profile"
});

clientGroup.rx("/user/logout", (socket) => {
    return socket.withSession(({session})=>{ delete session.userId; });
});


// export const userBeamReset = createQueue(_=>shopBeam.resetAll(), {
//     softMs:env.drivePullDelay*2,
//     pass:"last"
// });