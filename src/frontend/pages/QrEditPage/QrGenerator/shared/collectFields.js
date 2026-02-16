export const createFieldCollector = () => ({
    groups: new Map(),
    computed: undefined
});

export const pushCollectedToGroups = (collector, collected, mapItem) => {

    const { field, isShown, value, rawValue, issues, computed } = collected;
    if (computed != null) { collector.computed = computed; }
    if (!isShown || field.isBackground) { return; }

    const group = field.group || "other";
    if (!collector.groups.has(group)) { collector.groups.set(group, []); }

    const baseItem = { field, value, rawValue, issues, computed };
    const item = mapItem ? mapItem(baseItem, collected) : baseItem;
    collector.groups.get(group).push(item);
};
