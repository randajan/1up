export class FieldType {
    constructor(def = {}, parent) {
        const { id, format, defaults } = def;

        if (!id) { throw new Error("FieldType requires 'id'"); }

        this.id = id;
        this.parent = parent;
        this.root = parent?.root || this;

        if (!parent) {
            this.defaults = typeof defaults === "function" ? defaults : (opt => opt);
            this.format = typeof format === "function" ? format : (field, value) =>value;
            return;
        }

        this.defaults = (opt) => parent.defaults({ ...def, ...opt, subtype: id });

        this.format = (typeof format !== "function")
            ? parent.format
            : (field, value, pushIssue, computed) => {
            const base = parent.format?.(field, value, pushIssue, computed);
                if (base != null) { return format(field, base, pushIssue, computed); }
            };
    }

    applyDefaults(def = {}) {
        return this.defaults({ ...def, type: this.root?.id || this.id });
    }

    createSubType(defOrId, def) {
        const nextDef = typeof defOrId === "string"
            ? { ...(def || {}), id: defOrId }
            : (defOrId || {});
        return new FieldType(nextDef, this);
    }

    toString() {
        return this.id;
    }
}


export const createFieldType = (config) => new FieldType(config);
