import jet from "@randajan/jet-core";

export default {
  "id": { isPrimary: true, init: _ => jet.uid(32) },
  "name": {},
  "desc": {},
  "style": { type:"object" },
  "isPublic": { type:"boolean" },
  "viewers": { ref:"sysUsers", separator:"; " },
  "editors": { ref:"ssysUsers", separator:"; " },
  "owner": {},
  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:1  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display: 1 },
}