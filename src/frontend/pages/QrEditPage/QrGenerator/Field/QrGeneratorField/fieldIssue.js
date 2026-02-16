const _issuePriority = new Map([
    ["minor", 1],
    ["major", 2],
    ["critical", 3]
]);

export const resolveIssue = (issues, rawValue) => {
    if (!Array.isArray(issues) || issues.length === 0) { return null; }

    const touched = rawValue !== undefined;
    let best = null;
    let bestRank = 0;

    for (const issue of issues) {
        if (!issue?.level) { continue; }
        if (issue.level !== "critical" && !touched) { continue; }
        const rank = _issuePriority.get(issue.level) || 0;
        if (rank <= bestRank) { continue; }
        best = issue;
        bestRank = rank;
    }

    return best;
};
