import { FieldType } from "./FieldType.js";
import { isEmpty } from "../../tools.js";

export class FieldDefinition {
    constructor(group, id, type, opt={}) {
        if (!type || !(type instanceof FieldType)) {
            throw new Error("FieldDefinition requires valid FieldType");
        }

        const base = type.applyDefaults({ ...opt });
        Object.assign(this, base);

        this.id = id ?? base.id;
        this.group = group ?? base.group;
        this.type = type;

        this.showIf = this.showIf ?? (_ => true);

        if (typeof this.fb === "function") {
            this.fb = this.fb;
        } else {
            const fallback = this.fb;
            this.fb = (_ => fallback);
            this.def = fallback;
        }

        if (typeof this.req === "function") {
            this.req = this.req;
        } else {
            const required = this.req;
            this.req = (_ => Boolean(required));
        }
    }


    issuesFactory(iss) {
        const { id } = this;
        const issues = [];
        const pushIssue = (code, level, detail)=>{
            const issue = {id, code, level, detail};
            issues.push(issue); //local
            (iss[level] || (iss[level] = [])).push(issue); //together
        };
        return [issues, pushIssue];
    }

    collect(value, { computed, issues:iss }) {
        const { id } = this;
        const [ issues, pushIssue ] = this.issuesFactory(iss);

        const rawValue = value;
        const isShown = this.showIf(computed);

        if (!isShown) {
            if (value != null) { pushIssue("hidden", "minor"); }
            value = undefined;
        } else if (value != null) {
            value = this.type.format(this, value, pushIssue, computed);
        }

        if (value == null) {
            value = this.fb(computed);
            pushIssue("fallback", "minor", value);
        }

        computed[id] = value;
        if (isShown) {
            const required = this.req?.(computed);
            if (required && isEmpty(computed[id])) { pushIssue("required", "critical"); }
        }

        return { field:this, rawValue, value, isShown, issues, computed };
    }
}
