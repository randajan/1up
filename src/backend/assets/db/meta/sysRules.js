import jet from "@randajan/jet-core";

export default {
    "id": { isPrimary: true, init: _ => jet.uid() },
    "title": { isLabel: true },
    "sysUsers": { separator: "; ", ref: "sysUsers" },
    "sysEnts": { separator: "; ", ref: "sysEnts" },
    "readLvl": { type: "number" },
    "addLvl": { type: "number" },
    "editLvl": { type: "number" },
    "removeLvl": { type: "number" },
    "closeLvl": { type: "number" },
    "ownLvl": { type: "number" },
    "delegateLvl": { type: "number" },
    "updatedAt": { type: "datetime", formula: _ => new Date() },
    "updatedBy": { ref: "sysUsers", display: 1 },
    "createdAt": { type: "datetime", isReadonly: true, init: _ => new Date() },
    "createdBy": { ref: "sysUsers", isReadonly: true, display: 1 },
}