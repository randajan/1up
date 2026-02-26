import info from "@randajan/simple-app/info";
import env from "@randajan/simple-app/env";

import createGrant from "@randajan/oauth2-client/google";
import { getUser } from "../db/sugars";
import db from "../db/ramdb";

const pushAcc = async (oAcc) => {
    
    const profile = await oAcc.profile();
    const tokens = await oAcc.tokens();
    const scopes = await oAcc.scopes();

    const users = await db("sysUsers");
    const { email, name, picture } = profile;
    const { access_token, refresh_token, expiry_date } = tokens;

    const grant = "google";
    const grantId = email;

    const u = {
        picture,
        scopesAccepted:scopes,
        tokenAccess: access_token,
        tokenRefresh: refresh_token,
        expiresAt: expiry_date
    };

    const current = await users.rows.find(async row=>{
        if (grant !== await row("grant")) { return; }
        if (grantId !== await row("grantId")) { return; }
        return row;
    });

    if (!current) { return users.rows.add({ ...u, name, grant, grantId, email }); }

    await current.update(u);
    return current;
    
}

const onAuth = async (oAcc, { landingUri, state }) => {
    const acc = await pushAcc(oAcc);

    const [required, accepted] = await acc.eval(["scopesRequired", "scopesAccepted"]);
    const missing = required.filter(v=>!accepted.includes(v));

    if (missing.length) {
        return oauth2Google.getInitAuthURL({ scopes:required, landingUri, state });
    }
    
}

const getCredentials = async (email) => {
    const user = await getUser(`${email}`);
    const [access_token, refresh_token, expiry_date] = await user.eval(["tokenAccess", "tokenRefresh", "expiresAt"]);
    return { access_token, refresh_token, expiry_date };
}

export const oauth2Google = createGrant({
    isOffline:true,
    clientId: env.google.oauth2.id,
    clientSecret: env.google.oauth2.secret,
    redirectUri: `${env.home}/oauth/google/exit`,
    landingUri: env.home,
    fallbackUri: env.home,
    getCredentials,
    onAuth,
    onRenew:pushAcc,
});