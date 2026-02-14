
import { FieldDefinition } from "./FieldDefinition.js";
import { createDefaultFieldTypes } from "./defaultTypes.js";
import { solids } from "@randajan/props";

export class FieldRegistry {
    constructor(id, opt = {}) {
        const { normalize, format, define } = opt;

        solids(this, {
            id,
            fields: new Map(),
            types: createDefaultFieldTypes(),
            _normalize: typeof normalize == "function" ? normalize : v => v,
            _format: typeof format == "function" ? format : v => v
        });

        if (typeof define === "function") { define(this); }
    }

    defineSubtypes(subtypes = {}) {
        for (const id in subtypes) {
            if (this.types.has(id)) { throw new Error(`QRFieldType '${id}' already defined`); }
            const opts = subtypes[id];
            const parent = this.types.get(opts.type);
            if (!parent) { throw new Error(`QRField '${opts.type}' not found`); }
            this.types.set(id, parent.createSubType(id, opts));
        }
        return subtypes;
    }

    defineFields(group, fieldDefs = {}) {
        for (const id in fieldDefs) {
            if (this.fields.has(id)) { throw new Error(`QRField '${id}' already defined`); }
            const field = fieldDefs[id];
            const type = this.types.get(field.type);
            if (!type) { throw new Error(`QRFieldType '${field.type}' not found`); }
            const f = fieldDefs[id] = new FieldDefinition(group, id, type, field);
            this.fields.set(id, f);
        }
        return fieldDefs;
    }

    listFields() {
        return Array.from(this.fields.values());
    }

    normalize(input) {
        const v = this._normalize(input);
        if (v && typeof v == "object" && !Array.isArray(v)) { return v; }
        throw new Error(`ContentModule '${this.id}' expects object input`);
    }

    format(input = {}, opt={}) {
        const { collector, collect } = opt;
        const out = { computed:{}, issues:{}, input, collector };

        const normalized = this.normalize(input);
        for (const field of this.fields.values()) {
            const r = field.collect(normalized[field.id], out);
            if (collect) { collect(collector, r); }
        }

        if (!out.issues.critical?.length) {
            out.result = this._format(out, opt);
        }
        
        return out;
    };

    getField(id) {
        return this.fields.get(id);
    }
}
