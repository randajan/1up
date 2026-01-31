import jet from "@randajan/jet-core";

export default {
  id: { isPrimary: true, init: _ => jet.uid(16) },

  client: { ref: "webClients" },

  method: {},
  url: {},
  query: {},
  referrer: {},
  redirect:{ ref:"webRedirects" },
  redirectUrl:{},
  isUnique:{ type:"boolean" },
  createdAt: { type: "datetime", init: _ => new Date() },
};
