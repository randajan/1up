import jet from "@randajan/jet-core";

export default {
  "id": { isPrimary: true, init: _ => jet.uid(32) },
  "name": {},
  "desc": {},
  "qrStyle": { ref:"qrStyles" },
  "defaultType":{},
  "allowTypes":{ separator:"; " },
  "defaultEcc":{ init:"M" },
  "strictEcc":{ type:"boolean" },
  "defaultLabel":{},
  "strictLabel":{ type:"boolean" },
  "useCount": { type:"number", init:0, noNull:true },
  "useLimit": { type:"number" },
  "closedAt": { type:"datetime" },
  "closedBy": { ref:"sysAccs" },
  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:1  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display: 1 },
  "isExhausted": { type:"boolean", selector:["useLimit", "useCount"], formula:([l, c])=>(l != null && c >= l) },
  "isClosed": { type:"boolean", selector:"closedAt", formula:v=>!!v }
}