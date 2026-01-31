import jet from "@randajan/jet-core";
import { timestamps } from "@randajan/ram-db";
import createQueue from "@randajan/queue";

export default {
  id: { isPrimary: true, init: _ => jet.uid() },

  url: {},

  qSoftMs: { type: "duration" },
  qHardMs: { type: "duration" },
  qMinSize: { type: "number" },
  qMaxSize: { type: "number" },

  "owner":{ ref:"sysUsers" },

  "updatedAt": { type: "datetime", formula: _ => new Date() },
  "updatedBy": { ref: "sysUsers", display:1  },
  "createdAt": { type: "datetime", isReadonly:true, init: _ => new Date() },
  "createdBy": { ref: "sysUsers", isReadonly:true, display: 1 },
};
