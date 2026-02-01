import jet from "@randajan/jet-core";

export default {
  id: { isPrimary: true, init: _ => Math.ceil(Number.jet.rnd(0, 9))+jet.uid(6) },
  name:{},
  desc:{},
  url: {},

  isIgnoredDef: { type:"boolean" },
  isBannedDef: { type:"boolean" },

  qSoftMs: { type: "duration" },
  qHardMs: { type: "duration" },
  qMinSize: { type: "number" },
  qMaxSize: { type: "number" },

  "owner":{ ref:"sysUsers" },

  "closedAt":{ type:"datetime" },
  "closedBy": { ref:"sysUsers" },
  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:1  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display: 1 },
};
