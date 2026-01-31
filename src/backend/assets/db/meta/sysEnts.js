import jet from "@randajan/jet-core";

export default {
  "id": { isPrimary: true, init: _ => jet.uid() },
  "category": {},
  "plural": { isLabel: true, },
  "singular": {},
  "img": {},
  "info": {},
  "options": { separator: "; " },
  "security": {},
  "viewAll": {},
  "viewActive": {},
  "viewMy": {},
  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:1  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display: 1 },
}