import jet from "@randajan/jet-core";

export default {
  id: { isPrimary: true, init: _ => jet.uid(16) },

  createdAt: { type: "datetime", init: _ => new Date() },
  isUnique:{ type:"boolean" },
  redirectUrl:{},
  method: {},
  query: {},
  referrer: {},
  client: { ref: "webClients" },
  redirect:{ ref:"webRedirects" },
  

};