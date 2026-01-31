import jet from "@randajan/jet-core";

export default {
  "id": { isPrimary: true },
  "isGroup": { type: "boolean", init:false, display: 1 },
  "grantId": {},
  "grant": {},
  "name": {},
  "groups": { ref: "sysUsers", separator: "; ", display: 1 },
  "phone": {},
  "email": {},
  "address": {},
  "note": {},
  "closedAt": { type: "datetime" },
  "closedBy": { ref: "sysUsers" },
  "updatedAt": { type: "datetime", formula:_=>new Date() },
  "updatedBy": { ref: "sysUsers", display: 1 },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display: 1 }
}