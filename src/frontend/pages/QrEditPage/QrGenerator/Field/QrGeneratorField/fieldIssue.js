export const resolveIssue = (issues, rawValue) => {
    if (!Array.isArray(issues) || issues.length === 0) { return null; }

    const touched = rawValue !== undefined;
    let best = null;

    for (const issue of issues) {
        const { level } = issue;
        if (level !== 2 && !touched) { continue; }
        if (level === issues.maxLevel) { best = issue; break; }
    }

    return best;
};
