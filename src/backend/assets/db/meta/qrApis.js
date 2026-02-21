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
  "defaultSize":{},
  "strictSize":{ type:"boolean" },
  "defaultLabel":{},
  "strictLabel":{ type:"boolean" },
  "countDay": { type:"number", init:0, noNull:true },
  "limitDay": { type:"number" },
  "countWeek": { type:"number", init:0, noNull:true },
  "limitWeek": { type:"number" },
  "countMonth": { type:"number", init:0, noNull:true },
  "limitMonth": { type:"number" },
  "closedAt": { type:"datetime" },
  "closedBy": { ref:"sysUsers" },
  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:2  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display:2 },
  "isClosed": { type:"boolean", selector:"closedAt", formula:v=>!!v }
}