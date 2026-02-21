import jet from "@randajan/jet-core";

export default {
  "id": { isPrimary: true, init: _ => jet.uid(16) },
  "name": {},
  "desc": {},
  "style": { type:"object", display:1 },
  "isPublic": { type:"boolean" },
  "viewers": { ref:"sysUsers", separator:"; " },
  "editors": { ref:"ssysUsers", separator:"; " },
  "owner": { ref:"sysAccs" },
  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:2  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display:2 },
}