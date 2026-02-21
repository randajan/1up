import jet from "@randajan/jet-core";

export default {
  "id": { isPrimary: true },
  "isGroup": { type: "boolean", init:false, display:2 },
  "grantId": {},
  "grant": {},
  "picture":{},
  "name": {},
  "groups": { ref: "sysUsers", separator: "; ", display:2 },
  "phone": {},
  "email": {},
  "address": {},
  "note": {},

  "tokenAccess": { display:0 },
  "tokenRefresh": { display:0 },
  "scopesRequired": { separator:"; " },
  "scopesAccepted":{ separator:"; " },
  "expiresAt":{ type:"datetime" },

  "closedAt": { type: "datetime" },
  "closedBy": { ref: "sysUsers" },
  "updatedAt": { type: "datetime", formula:_=>new Date() },
  "updatedBy": { ref: "sysUsers", display:2 },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display:2 },

  "has_token_access":{ type:"boolean", isVirtual:true, selector:"tokenAccess" },
  "has_token_refresh":{ type:"boolean", isVirtual:true, selector:"tokenRefresh" }
}